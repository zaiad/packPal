const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController.js')
const auth = require('../middleware/auth.js');

router.get('/',controller.getAllUser);
router.get('/getOneUser',controller.getOneUser);
router.put('/:id',controller.updateUser);
router.delete('/:id',controller.deleteUser);
router.post('/',controller.createUser);

module.exports = router;