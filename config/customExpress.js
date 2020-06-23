const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const cors = require('cors');
//FUNÇÃO RESPONSÁVEL POR CONFIGURAR O APP DO EXPRESS
module.exports = () => {
    const app = express();
    app.use(cors({ origin: 'http://vefixapp-com-br.umbler.net'}))

    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    consign()
        .include('controllers')
        .into(app);
    
    return app;
}

