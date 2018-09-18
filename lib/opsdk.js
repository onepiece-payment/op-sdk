const opSystem = require('./connect');

function Opsdk(options) {
    this.pirate_token = options.pirate_token;
    this.notify_url = options.notify_url;
}

const props = Opsdk.prototype;

props.initiatePayment = async (options) => {
    try {
        console.log("I'm going to initialize payment...");
        const waiting = await opSystem.goInitiatePayment(options);
        return waiting;
    }
    catch (error) {
        console.log(`Got error: ${error}`);
    }
};

props.getPaymentStatus = async (options) => {
    try {
        console.log("I'm going to get payment status...");
        const waiting = await opSystem.goGetPaymentStatus(options);
        return waiting;
    }
    catch (error) {
        console.log(`Got error: ${error}`);
    }
};

props.getAvailablePayments = async (pirateToken) => {
    try {
        console.log("I'm going to get available payment methods...")
        const waiting = await opSystem.getAvailablePayments(pirateToken);
        return waiting;
    }
    catch (error) {
        console.log(`Got error: ${error}`);
    }
}

props.initiatePayment = props.initiatePayment;
props.getPaymentStatus = props.getPaymentStatus;
props.getAvailablePayments = props.getAvailablePayments;

module.exports = Opsdk;