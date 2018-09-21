# Steps to use our service
1) Contact onepiece.payment@gmail.com to set up an account
2) Once your account is set up, login to your Admin Console account at https://admin.one-piece.us
3) Create a new pirate_token in the console
4) You may now use the available methods below and start using our service with the pirate_token
<br><br><br>

# Option 1: Utilizing the npm op-sdk

## How does op-sdk work
This package is publicly available for anyone to install. However, you will need to sign up an account with One-Piece in order to be able to use our service. With this sdk and your One-Piece account, you will be able to get available payment methods, initate payments and check status of a specific transaction. 

## How to start
 * Run `npm install op-sdk --save` to install the latest npm package. 

## Instantiate an Opsdk instance
```
//javascript

let newMerchant = new Opsdk({
    pirate_token: {can be found in the Admin Console},
    notify_url: {notify url},
    return_url: {return url}
})
```

## Available methods from this sdk
| No. | Purpose | Method | Parameter(s) | Description |
| --- | --- | --- | --- | --- |
| 1 | Get Available Payment Methods | getAvailablePayments() | pirate_token | This function will be used when the user needs to get the list of available payment methods. It takes in the `pirate_token` as a parameter. Our system will respond with an array of available payment methods. |
| 2 | Initiate Payment | initiatePayment() | options | This function will be used to initiate a payment transaction. It takes in an object called `options` as a request body (See `options` requirements below). Once the transaction is initiated properly, our system will generate a transaction and respond with a paymentToken. The transaction will also be displayed in the Admin Console. |
| 3 | Get Payment Status | goGetPaymentStatus() | paymentToken | When the payment has been recieved or updated, our system will send a POST request to the provided notify_url with payment status. In the event when the user wants to check the transaction status, this call can be used to get the status of the specific transaction. The call takes in the `paymentToken` as a parameter and will return with a status. User will be able to view the transaction details in the Admin Console. |

## Request parameters

## Opsdk (for op-sdk constructor)
| Field name | Variable name | Required | Types of | Sample value | Description |
| --- | --- | --- | --- | --- | --- |
| Pirate Token | pirate_token | yes | string(32) | PIRATE_b956db50a8ffac2d82a253a28259d07f | This data can be found in the Admin console |
| Notify URL | notify_url | yes | string(32) | notify_url.com | Our system will make a POST call to this url with the payment status once we receive an update from the payment method's merchant |
| Return URL | return_url | optional | string(32) | return_url.com | Your desired redirect destination url once the payment has been received  |

## Get Available Payment Methods (pirate_token)
| Field name | Variable name | Required | Types of | Sample value | Description |
| --- | --- | --- | --- | --- | --- |
| Pirate Token | pirate_token | yes | string(32) | PIRATE_b956db50a8ffac2d82a253a28259d07f | This data can be found in the Admin console |

## Initiate Payment (options)
| Field name | Variable name | Required | Types of | Sample value | Description |
| --- | --- | --- | --- | --- | --- |
| Amount | amount | yes | int | 100 | ￥1 = 100 , ￥100 = 10000 |
| Payment Method | payment_method | yes | string(32) | wechatpay | value must be one of the following strings: wechatpay / alipay / qqpay / jdpay |
| Pirate Token | pirate_token | yes | string(32) | PIRATE_b956db50a8ffac2d82a253a28259d07f | This data can be found in the Admin console |
| Notify Url | notify_url | yes | string(32) | notify_url.com | Our system will make a POST call to this url with the payment status once we receive an update from the payment method's merchant |
| Return Url | return_url | optional | string(32) | return_url.com | Your desired redirect destination url once the payment has been received |
| Customer's ip address | browser_ip_address | optional | string(32) | 293.242.53.21 | Payee's ip address |
| Customer's mac address | browser_mac_address | optional | string(32) | 00-14-22-01-23-45 | Payee's mac address |

## Get Payment Status (payment_token)
| Field name | Variable name | Required | Types of | Sample value | Description |
| --- | --- | --- | --- | --- | --- |
| Payment Token | payment_token | yes | string(32) | TRANS_4b2107c69eb522be74c90cbbdcd1064c | Token to verify payment status |

## Example for express app

In order to use the op-sdk in your node app, you will need to `require` and setup in desired route.

```
  ...
  //op-sdk required
  const Opsdk = require('op-sdk');
  ...
  
  //create new Opsdk instance with required constructor
  let newMerchant = new Opsdk({
      pirate_token: '{your own pirate_token}', //This can be retrieved from Admin Console
      notify_url: '{your own notify_url}' //Set up your own notify url
      return_url: '{your own return_url}' //Set up your own return url
  });

  //sample route to get available payment methods
  router.get('/methods', async (req, res) => {

      const getAvailableMethods = await newMerchant.getAvailablePayments(pirate_token);
      const availableMethods = getAvailableMethods.payload.methods;

      //Logging response data
      console.log(availableMethods);
      res.render('index', { title: "Available Methods", data: availableMethods })
  })
  
  //sample route to initiate payment
  router.get('/checkout', async (req, res) => {

      const options = {
            'amount': 101, //￥1 will need to be converted to 100 , ￥100 will need to be converted to 10000. Example: (parseFloat(amount) *100).toFixed(0)
            'payment_method': 'wechatpay', //payment_method must be spelled exactly as: 'wechatpay', 'alipay', 'qqpay' or 'jdpay"
            'notify_url': newMerchant.notify_url,
            'pirate_token': newMerchant.pirate_token,
            'browser_ip_address': 'provideCustomerIP', //optional
            'browser_mac_address': 'provideCustomerMacAddress', //optional
      };

      const newTransaction = await newMerchant.initiatePayment(options);
      const gotQrcode = newTransaction.payload.qrcodeURL;
      const paymentToken = newTransaction.payload.paymentToken;

      //Logging response data
      console.log(gotQrcode);
      console.log(paymentToken);
      res.render('index', { title: "GOT QR CODE", data: [gotQrcode, paymentToken] });
  });
  
  
  //sample route to get payment status
  router.get('/status', async (req, res) => {

      const gotStatus = await newMerchant.goGetPaymentStatus(payment_token);
      res.render('index', { title: "Got Payment Status", data: [gotStatus.status, gotStatus.payload.payment_status.message });

  });

  module.exports = router;
```
<br><br>

# Option 2: Make direct calls to our system
## 1) Get available payment methods from our system<br>
Description: This function will be used when the user needs to get the list of available payment methods. It takes in the pirate_token as a parameter. Our system will respond with an array of payment methods the user can use.<br>
URL: https://api.one-piece.us/payment/methods/availability/{pirate_token}/{magic_num}/{signature}<br>
Method: GET

| Parameters | Description |
| --- | --- |
| pirate_token | This value can be found in the Admin Console |
| magic_num | One random number |
| signature | md5(magic_num + pirate_token) |
<br>

## 2) Initiate payment<br>
Description: This function will be used to initiate a payment transaction. It takes in an object called `options` as a request body (See `options` requirements below). Once the transaction is initiated properly, our system will generate a transaction (which can be found in the Admin console) and respond with a paymentToken.<br>
URL: https://api.one-piece.us/payment/<br>
Method: POST<br>
Body: {options}

| Field name | Variable name | Required | Types of | Sample value | Description |
| --- | --- | --- | --- | --- | --- |
| Amount | amount | yes | int | 100 | ￥1 = 100 , ￥100 = 10000 |
| Payment Method | payment_method | yes | string(32) | wechatpay | value must be one of the following strings: wechatpay / alipay / qqpay / jdpay |
| Pirate Token | pirate_token | yes | string(32) | PIRATE_b956db50a8ffac2d82a253a28259d07f | This data can be found in the Admin console |
| Notify Url | notify_url | yes | string(32) | notify_url.com | Our system will make a POST call to this url with the payment status once we receive an update from the payment method's merchant |
| Return Url | return_url | optional | string(32) | return_url.com | Your desired redirect destination url once the payment has been received |
| Customer's ip address | browser_ip_address | optional | string(32) | 293.242.53.21 | Payee's ip address |
| Customer's mac address | browser_mac_address | optional | string(32) | 00-14-22-01-23-45 | Payee's mac address |
| Static signature | signature | yes | string(32) | id83ud84ufje73h skd93hr5ghs83j | md5(magic_num + '' + amount + payment_method + pirate_token + notify_url) |
<br>

## 3) Get payment status<br>
Description: When the payment has been recieved or updated, Our system will make a POST call to the provided notify_url with the payment status. In the event when the user wants to check the transaction status, this call can be used to get the status of the specific transaction. The call takes in the `payment_token` as a parameter and will return with a status. User will be able to view the trasaction details in the Admin Console.<br>
URL: https://api.one-piece.us/payment/{payment_token}/{magic_num}/{signature}<br>
Method: GET

| Parameters | Description |
| --- | --- |
| paymentToken | This token can be found in the return response from the initiate payment method above - `#2` |
| magicNum | One random number |
| signature | md5(magic_num + payment_token) |

<br><br>

# Reference
Admin Console: https://admin.one-piece.us<br/>
React Demo: http://demo.one-piece.us/<br/>
Demo Repo: https://github.com/onepiece-payment/react-demo<br/>
Questions: onepiece.payment@gmail.com

