const twilio = require('twilio');
const { sid, auth } = require('./twilio_account.json');

module.exports = new twilio(sid, auth);
