const fetch = require('node-fetch');
const root_url = 'https://api.one-piece.us';
const md5 = require('md5');

const goInitiatePayment = (paymentObject) => {
    const magicNum = Math.ceil(Math.random() * 4000);
    const { amount, payment_method, pirate_token, notify_url } = paymentObject;
    const signature = md5(magicNum + '' + amount + payment_method + pirate_token + notify_url);
    const finalObj = Object.assign({ magicNum, signature }, paymentObject);

    return fetch(`${root_url}/payment`, {
        method: 'POST',
        body: JSON.stringify(finalObj),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(error => console.log(error));
};


const goGetPaymentStatus = (pieceToken) => {

    const magicNum = Math.ceil(Math.random() * 4000);
    const signature = md5(magicNum + pieceToken);

    return fetch(`${root_url}/payment/${pieceToken}/${magicNum}/${signature}`, {
        method: 'GET'
    })
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(error => console.log(error))
};


const getAvailablePayments = (pirateToken) => {

    return fetch(`${root_url}/payment/methods/availability/${pirateToken}/${magicNum}/${signature}`, {
        method: 'GET'
    })
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(error => console.log(error))
};


module.exports = {
    goInitiatePayment,
    goGetPaymentStatus,
    getAvailablePayments
};
