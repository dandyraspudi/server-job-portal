const router = require('express').Router();
const userController = require('../controllers/usersController');

router.get('/', userController.userList);
router.post('/register', userController.postRegister);
router.post('/login', userController.postLogin);
router.post('/authGoogle', userController.postAuthGoogle);

module.exports = router;