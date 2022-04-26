const express = require('express');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

const userRoutes = require('./routes/user');


const connectMongoDB = `mongodb+srv://P6OC-Database:123ABC456@cluster0.t5zod.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(connectMongoDB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

app.use(mongoSanitize());

app.use('/api/auth', userRoutes);

module.exports = app;