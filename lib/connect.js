const fetch = require('node-fetch');

const goInitiatePayment = (paymentObject) => {

    return fetch('https://api.one-piece.us/payment', {
        method: 'POST',
        body: JSON.stringify(paymentObject),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(error => console.log(error));
};


const goGetPaymentStatus = (pieceToken) => {

    return fetch(`https://api.one-piece.us/payment/${pieceToken}`, {
        method: 'GET'
    })
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(error => console.log(error))
};


const getAvailablePayments = () => {

    return fetch (`https://api.one-piece.us/payment/methods/availability`, {
        method: 'GET'
    })

    .then(res => res.json())
    .then(data => {
        return data;
    })
    .catch(error => console.log(error))
}

module.exports = {
    goInitiatePayment,
    goGetPaymentStatus,
    getAvailablePayments
};
