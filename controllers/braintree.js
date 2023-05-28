const User = require("../models/User");
const braintree = require('braintree')


// braintree config
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHENT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

exports.generateToken = (req, res, next) => {

    gateway.clientToken.generate({}, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        else {
            res.send(result)
        }
    })
}

exports.postProcessPayment = (req, res, next) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amoutFromTheClient = req.body.amount;

    let newTransaction = gateway.transaction.sale({
        amount: amoutFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
            submitForSettlement: true,
        }
    }, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.json(result)
        }
    })
}