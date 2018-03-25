const router = require('express').Router();
const UsersController = require('../controllers/users_controller');

router.get('/', UsersController.index);

router.get('/create', UsersController.create);

router.post('/create', UsersController.store);

router.get('/edit/:id', UsersController.edit);

router.put('/:id', UsersController.update);

router.delete('/:id', UsersController.delete);

module.exports = router;