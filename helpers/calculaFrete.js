const { calcularPrecoPrazo } = require('correios-brasil');

module.exports = (app) => {
  app.post('/calcularfrete', (req, res) => {
    const args = req.body;
    //console.log(args);

    calcularPrecoPrazo(args).then((response) => {
      res.status(200).json({ response });
    });
  });
};


