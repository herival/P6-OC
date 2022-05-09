const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user')

// création de la roupe pour s'enregistrer
router.post('/signup', userCtrl.signup);
// création de la route pour se connecter
router.post('/login', userCtrl.login);

module.exports = router;