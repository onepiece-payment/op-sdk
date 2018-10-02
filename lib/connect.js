const request = require('request');
const OP_URL = 'https://api.one-piece.us';

cost opRequest = (method, params, headers, body) => {
    let final_url = OP_URL + '/';
    params.forEach(param => {
        final_url += (param + '/');
    });

    let options = {
        method: method,
        url: final_url,
        body: body,
        headers: headers,
        json: true
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if(!error) {
                if(body.status === ture) {
                    resolve(body.payload ? body.payload : {});
                } else {
                    reject(body.message);
                }
            } else {
                reject(error);
            }
        });
    });
};

module.exports.opRequest = opRequest;