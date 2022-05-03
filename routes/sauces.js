const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces.js');


// Creation d'une nouvelle sauce
router.post('/', auth, multer, saucesCtrl.createSauce);
// Mettre à jour une sauce existante
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
// Supprimer une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);
// Renvoie toutes les sauces dans la collection
router.get('/', saucesCtrl.getAllSauces);
// Renvoie une sauce spécifique par son id
router.get('/:id', saucesCtrl.getOneSauce);
// Aimer ou non une sauce
router.post('/:id/like', auth, saucesCtrl.likeOrDislikeSauce);

module.exports = router;
