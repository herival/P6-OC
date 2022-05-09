const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST Signup
exports.signup = (req, res, next) => {
  // const regex =/^/ 
  //regexp pour prod 

  // Min 8 characters 1 Uppercase Alphabet, 1 Lowercase Alphabet and 1 Number
  const regex =/^(?=.{8,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?\W).*$/

  // const regex = /^(?=.[a-z])(?=.[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/ 

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