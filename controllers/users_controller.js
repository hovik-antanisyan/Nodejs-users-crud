const User = require('../models/user');

module.exports = {
    async index(req, res, next) {
        try {
            const users = await User.find().lean();
            const userCount = await User.count();
            users.map(function (user, index) {
                users[index].dob = user.dob.toDateString();
            });


            req.app.locals.title = 'User list';
            res.render('users/index', {users, userCount});
        } catch (error) {
            next(error);
        }
    },

    create(req, res, next) {
        req.app.locals.title = 'Create user';
        res.render('users/create');
    },

    async store(req, res, next) {
        const props = req.body;

        try {
            const user = new User({
                firstName: props.firstName,
                lastName: props.lastName,
                dob: props.dob,
                address: props.address,
                address2: props.address2,
                country: props.country,
                city: props.city,
                postalCode: props.postalCode,
            });

            const errors = [];
            const validationErrors = user.validateSync();
            if (validationErrors) {
                for (const key in validationErrors.errors) {
                    if (validationErrors.errors.hasOwnProperty(key)) {
                        errors[key] = validationErrors.errors[key].message;
                    }
                }
                return res.render('users/create', {errors, props});
            }

            await user.save();
            res.redirect('/users');
        } catch (err) {
            next(err);
        }
    },

    async edit(req, res, next) {
        try {
            const id = req.params.id;
            const user = await User.findOne({_id: id}).lean();

            if (!user) {
                return next(new Error('No user found with id.'));
            }

            user.dob = user.dob.toISOString().slice(0, 10);

            req.app.locals.title = 'User update';
            res.render('users/edit', {user});
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const props = req.body;
            const id = req.params.id;
            const user = await User.findById(id);

            user.firstName = props.firstName;
            user.lastName = props.lastName;
            user.dob = props.dob;
            user.address = props.address;
            user.address2 = props.address2;
            user.country = props.country;
            user.city = props.city;
            user.postalCode = props.postalCode;

            const errors = [];
            const validationErrors = user.validateSync();
            if (validationErrors) {
                for (const key in validationErrors.errors) {
                    if (validationErrors.errors.hasOwnProperty(key)) {
                        errors[key] = validationErrors.errors[key].message;
                    }
                }
                props._id = id;
                return res.render(`users/edit`, {errors, user: props});
            }

            await user.save();
            res.redirect('/users');
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const id = req.params.id;
            await User.findByIdAndRemove(id);
            res.redirect('/users');
        } catch (error) {
            next(error);
        }

    }
};