const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// POST Signup
exports.signup = (req, res, next) => {
  
  // Min 1 Majuscule, 1 minuscule Alphabet,  1 chiffre , 1 caractere spécial
  const regex =/([a-zA-Z][0-9]).+$/

  if (req.body.password.match(regex)) {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      let emailString = req.body.email.toString();

      const user = new User({
        email: emailString,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  } else {
  throw  Error("Le mot de passe n'est pas assez sécurisé");
  }
};

// POST Login
exports.login = (req, res, next) => {

  let emailString = req.body.email.toString();

  User.findOne({ email: emailString })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET'
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};