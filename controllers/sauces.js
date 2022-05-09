const Sauce = require('../models/sauce.js');
const fs = require('fs');

// creation nouvelle Sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    // Genère l'url de l'image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Modifier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(
      (sauce) => {
        if (!sauce) {
          return res.status(404).json({
            error: new Error('Sauce non trouvé!')
          });
        }
        // controller si le propriétaire de la sauce est bien celui qui est connecté
        if (sauce.userId !== req.auth.userId) {
          return res.status(400).json({
            error: new Error('Requête non autorisée!')
          })
        }
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
        

      }  
    )
    .catch(error => res.status(500).json({ error }));

};

// Récuperer toute les sauces dans la collection
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

// Récupérer une sauce par son id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// Aimer ou non une sauce
exports.likeOrDislikeSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      if (req.body.like === 1 && !sauce.usersLiked.includes(req.body.userId)){
        Sauce.updateOne({ _id: req.params.id },{ $inc: { likes: 1 }, $push: {usersLiked: req.body.userId} })
          .then(() => res.status(200).json({ message: 'sauce liked' }))
          .catch(error => res.status(400).json({ error }));
      }
      else if (req.body.like === -1 && !sauce.usersDisliked.includes(req.body.userId)){
        Sauce.updateOne({ _id: req.params.id },{ $inc: { dislikes: +1 }, $push: {usersDisliked: req.body.userId} })
          .then(() => res.status(200).json({ message: 'sauce disliked' }))
          .catch(error => res.status(400).json({ error }));
      }
      else if (req.body.like === 0){
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id },{ $inc: { likes: -1 }, $pull: {usersLiked: req.body.userId} })
            .then(() => res.status(200).json({ message: 'likes - 1' }))
            .catch(error => res.status(400).json({ error }));
        }
        else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id },{ $inc: { dislikes: -1 }, $pull: {usersDisliked: req.body.userId} })
            .then(() => res.status(200).json({ message: 'dislikes - 1' }))
            .catch(error => res.status(400).json({ error }));
        }
      }
    })
    .catch(error => res.status(400).json({ error }));
};
