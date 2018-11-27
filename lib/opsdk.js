const kh = require('./connect');
const md5 = require('md5');

const OPSdk = function (pirate_token, pirate_key) {
    this.pirate_token = pirate_token;
    this.pirate_key = pirate_key;

    this.findPaymentMethods = findPaymentMethods.bind(this);
    this.checkPaymentStatus = checkPaymentStatus.bind(this);
    this.initPayment = initPayment.bind(this);
    this.findAvailiblePriceList = findAvailiblePriceList.bind(this);
};

const initPayment = function (options) {
    if (!options) throw new Error('CANNOT FIND OPTIONS - INIT PAYMENT');
    
    const {amount, payment_method, notify_url, return_url, browser_ip_address, browser_mac_address, order_num} = options;
    if (!amount) throw new Error('CANNOT FIND AMOUNT - INIT PAYMENT');
    if (!payment_method) throw new Error('CANNOT FIND PAYMENT_METHOD - INIT PAYMENT');
    if (!return_url) throw new Error('CANNOT FIND RETURN_URL - INIT PAYMENT');
    if (!notify_url) throw new Error('CANNOT FIND NOTIFY_URL - INIT PAYMENT');

    try {
        //LIMITAION 4000
        const magicNum = Math.ceil(Math.random() * 4000);
        const signature = md5(`${magicNum}${amount}${payment_method}${this.pirate_token}${notify_url}${return_url}${this.pirate_key}`);
        const finalObj = {
            payment_method,
            pirate_token: this.pirate_token,
            notify_url,
            return_url,
            order_num,
            amount,
            browser_ip_address,
            browser_mac_address,
            magicNum,
            signature
        };
        return kh.khRequest('POST', ['payment'], {}, finalObj);
    } catch (e) {
        throw e;
    }
};

const checkPaymentStatus = function (pieceToken) {
    try {
        const magicNum = Math.ceil(Math.random() * 4000);
        const signature = md5(`${magicNum}${this.pirate_token}${pieceToken}${this.pirate_key}`);
        return kh.khRequest('GET', ['payment', 'status', this.pirate_token, pieceToken, magicNum, signature], {}, {});
    } catch (e) {
        throw e;
    }
};

const findPaymentMethods = function () {
    try {
        const magicNum = Math.ceil(Math.random() * 4000);
        const signature = md5(`${magicNum}${this.pirate_token}${this.pirate_key}`);
        return kh.khRequest('GET', ['payment', 'methods', 'availability', this.pirate_token, magicNum, signature], {}, {});
    } catch (e) {
        throw e;
    }
};

const findAvailiblePriceList = function () {
    try {
        const magicNum = Math.ceil(Math.random() * 4000);
        const signature = md5(`${magicNum}${this.pirate_token}${this.pirate_key}`);
        return kh.khRequest('GET', ['payment', 'prices', this.pirate_token, magicNum, signature], {}, {});
    } catch (e) {
        throw e;
    }
};

module.exports = OPSdk;

