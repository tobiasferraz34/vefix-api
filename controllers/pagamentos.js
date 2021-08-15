
const getPrivateTokenStripe = require('../services/getPrivateTokenStripe');
const Auth = require('../models/auth');

module.exports = (app) => {
  app.post('/pagamentos', Auth.verificaJWT, (req, res) => {
    getPrivateTokenStripe(req.body.id_oficina, function (err, data) {
      if (err) {
        console.log(err);
      }

      // console.log(data);
      // console.log(req.body);
      // console.log(req.email)

      const stripe = require('stripe')(data);

      try {
        stripe.customers
          .create({
            name: req.body.name,
            email: req.email,
            source: req.body.stripeToken,
          })
          .then((customer) =>
            stripe.charges.create({
              amount: req.body.amount,
              currency: 'brl',
              customer: customer.id,
              description: 'Pagamento realizado com sucesso.',
            })
          )
          .then(() =>
            res.json({ status: 200, msg: 'Pagamento realizado com sucesso.' })
          )
          .catch((err) => console.log(err));
      } catch (err) {
        res.send(err);
      }
    });
  });
};
