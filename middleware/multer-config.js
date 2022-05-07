//Gérer les requêtes HTTP avec envoie de fichier

const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif':'gif'
};

//la destination du fichier
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //générer un nom de fichier unique avec le temps
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name +"_"+ Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');