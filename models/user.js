const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Création schéma de donnée pour la table user
const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true},
	password: { type: String, required: true}
});

// Unique-validator permet de controller l'unicité d'un utilisateur par le champ mail. 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);