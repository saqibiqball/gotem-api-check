const stripe = require('stripe')(process.env.STRIPE_SECRED_KEY);

module.exports = stripe;
