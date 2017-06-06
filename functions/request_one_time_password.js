const admin = require('firebase-admin');
const twilio = require('./twilio');
const { number } = require('./twilio_account.json');

module.exports = (req, res) => {
  if (!req.body.phone) {
    return res.status(422).send({ error: 'You must provide a phone number' });
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, '');

  admin.auth().getUser(phone)
    .then(user => {
      const code = (Math.floor((Math.random() * 8999 + 1000)))

      twilio.messages.create({
        to: '+' + phone,
        from: number,
        body: `Your code is ${code}`,
      }, (err) => {
        if (err) {
          return res.status(422).send(err);
        }

        admin.database().ref(`users/${phone}`)
          .update({ code, codeValid: true }, () => {
            res.send({ success: true });
          });
      });
    })
    .catch(err => {
      res.status(422).send({ error: err });
    });
};
