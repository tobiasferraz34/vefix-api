const express = require('express');
const path = require('path');
const consign = require('consign');
const cors = require('cors');

//FUNÇÃO RESPONSÁVEL POR CONFIGURAR O APP DO EXPRESS
module.exports = () => {
  const app = express();

  //http://localhost:3000
  //origin: 'http://vefix-com-br.umbler.net'
  app.use(cors({ origin: 'http://vefix-com-br.umbler.net', credentials: true }));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  app.use('/uploads', express.static('uploads'));
  consign().include('controllers').into(app);

  return app;
};
