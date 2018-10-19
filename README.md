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

import OPSdk from 'op-sdk';

let newMerchant = new OPSdk(pirate_token) //The "pirate_token" can be found in the Admin Console
```

## Available methods from this sdk
| No. | Purpose | Method | Parameter(s) | Description |
| --- | --- | --- | --- | --- |
| 1 | Get Available Payment Methods | findPaymentMethods() | pirate_token | This function will be used when the user needs to get the list of available payment methods. It takes in the `pirate_token` as a parameter. Our system will respond with an array of available payment methods. |
| 2 | Get Acceptable Price List | findAvailiblePriceList() | none | This function will be used when the user needs to get the list of acceptable price. Our system will respond with an array of available price list. |
| 3 | Initiate Payment | initPayment() | options | This function will be used to initiate a payment transaction. It takes in an object called `options` as a request body (See `options` requirements below). Once the transaction is initiated properly, our system will generate a transaction and respond with a paymentToken as well as a link to the QR Code. Once payment has been received, the system will automatically redirect to the provided "return_url". The transaction will also be displayed in the Admin Console. |
| 4 | Get Payment Status | checkPaymentStatus() | payment_token | When the payment has been recieved or updated, our system will send a POST request to the provided "notify_url" with payment status. In the event when the user wants to check the transaction status, this call can be used to get the status of the specific transaction. The call takes in the `payment_token` as a parameter and will return with a status. User will be able to view the transaction details in the Admin Console. |

## Request parameters

## OPSdk (for op-sdk constructor)
| Field name | Variable name | Required | Types of | Sample value | Description |
| --- | --- | --- | --- | --- | --- |
| Pirate Token | pirate_token | yes | string(32) | PIRATE_b956db50a8ffac2d82a253a28259d07f | This data can be found in the Admin console |

## Get Available Payment Methods (pirate_token)
| Field name | Variable name | Required | Types of | Sample value | Description |
| --- | --- | --- | --- | --- | --- |
| Pirate Token | pirate_token | yes | string(32) | PIRATE_b956db50a8ffac2d82a253a28259d07f | This data can be found in the Admin console |

## Initiate Payment (options)
| Field name | Variable name | Required | Types of | Sample value | Description |
| --- | --- | --- | --- | --- | --- |
| Amount | amount | yes | int | 100 | 100 = ￥1, 10000 = ￥100 |
| Payment Method | payment_method | yes | string(32) | wechatpay | value must be one of the following strings: wechatpay / alipay / qqpay |
| Notify Url | notify_url | yes | string(32) | http://yourcompany.com/notify/wechat | Our system will make a POST call to this url with the payment status once we receive an update from the payment method's merchant |
| Return Url | return_url | yes | string(32) | http://yourcompany.com/pay/success | Your desired redirect destination url once the payment has been received |
| Customer's ip address | browser_ip_address | optional | string(32) | 293.242.53.21 | Payee's ip address |
| Customer's mac address | browser_mac_address | optional | string(32) | 00-14-22-01-23-45 | Payee's mac address |

## Get Payment Status (payment_token)
| Field name | Variable name | Required | Types of | Sample value | Description |
| --- | --- | --- | --- | --- | --- |
| Payment Token | payment_token | yes | string(32) | TRANS_4b2107c69eb522be74c90cbbdcd1064c | Token to get payment status |
<br><br><br>

## Example for express app

In order to use the op-sdk in your node app, you will need to `require` and setup in desired route.

```
  ...
  //op-sdk required
  const OPSdk = require('op-sdk');
  ...
  
  //create new Opsdk instance with required constructor
  let newMerchant = new Opsdk(pirate_token) //The "pirate_token" can be retrieved from Admin Console

  //sample route to get available payment methods
  router.get('/methods', async (req, res) => {

      const getAvailableMethods = await newMerchant.findPaymentMethods(pirate_token);
      const availableMethods = getAvailableMethods.payload.methods;

      //Logging response data
      console.log(availableMethods);
      res.render('index', { title: "Available Methods", data: availableMethods })
  })

  //sample route to get acceptable price list
  router.get('/price', async (req, res) => {

      const getAcceptablePriceList = await newMerchant.findAvailiblePriceList();
      const priceList = getAcceptablePriceList.payload.prices;
      
      //Logging response data
      console.log(priceList);
      res.render('index', { title: "Available Prices", data: priceList })
  })
  
  //sample route to initiate payment
  router.get('/checkout', async (req, res) => {

      const amount = (parseFloat(amount) *100).toFixed(0); //￥1 will need to be converted to 100, ￥100 will need to be converted to 10000
      const notify_url = http://yourcompany/notify/wechat //example
      const return_url = http://yourcompany/pay/success //example

      const options = {
            'amount': amount
            'payment_method': 'wechatpay', //payment_method must be spelled exactly as: 'wechatpay', 'alipay' or 'qqpay'
            'notify_url': notify_url,
            'return_url': return_url,
            'browser_ip_address': 'provideCustomerIP', //optional
            'browser_mac_address': 'provideCustomerMacAddress', //optional
      };

      const newTransaction = await newMerchant.initPayment(options);

      //Redirect to our QR code page. Once payment has been recevied, the system will automatically redirect to the provided "return_url"
      res.redirect(newTransaction.qrcodeURL)
  });
  
  //sample route to get payment status
  router.get('/status', async (req, res) => {

      const gotStatus = await newMerchant.checkPaymentStatus(payment_token);
      res.render('index', { title: "Got Payment Status", data: [gotStatus.status, gotStatus.payload.payment_status.message });
  });

  module.exports = router;
```
<br><br><br>

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

## 2) Get acceptable price list<br>
Description: This function will be used when the user needs to get the list of acceptable price. Our system will respond with an array of available price list.<br>
URL: https://api.one-piece.us/payment/prices/{pirate_token}/{magic_num}/{signature}<br>
Method: GET

| Parameters | Description |
| --- | --- |
| pirate_token | This value can be found in the Admin Console |
| magic_num | One random number |
| signature | md5(magic_num + pirate_token) |
<br>

## 3) Initiate payment<br>
Description: This function will be used to initiate a payment transaction. It takes in an object called `options` as a request body (See `options` requirements below). Once the transaction is initiated properly, our system will generate a transaction and respond with a paymentToken as well as a link to the QR Code. Once payment has been received, the system will automatically redirect to the provided "return_url". The user will be able to view the transaction details in the Admin Console.<br>
URL: https://api.one-piece.us/payment/<br>
Method: POST<br>
Body: {options}

| Field name | Variable name | Required | Types of | Sample value | Description |
| --- | --- | --- | --- | --- | --- |
| Amount | amount | yes | int | 100 | 100 = ￥1, 10000 = ￥100 |
| Payment Method | payment_method | yes | string(32) | wechatpay | value must be one of the following strings: wechatpay / alipay / qqpay / jdpay |
| Priate Token | pirate_token | yes | string(32) | PIRATE_b956db50a8ffac2d82a253a28259d07f | This value can be found in the Admin Console |
| Notify Url | notify_url | yes | string(32) | http://yourcompany.com/notify/wechat | Our system will make a POST call to this url with the payment status once we receive an update from the payment method's merchant |
| Return Url | return_url | yes | string(32) | http://yourcompany.com/pay/success | Your desired redirect destination url once the payment has been received |
| Customer's ip address | browser_ip_address | optional | string(32) | 293.242.53.21 | Payee's ip address |
| Customer's mac address | browser_mac_address | optional | string(32) | 00-14-22-01-23-45 | Payee's mac address |
|Magic Number | magicNum | yes | string(32) | 888 | One random number |
| Static Signature | signature | yes | string(32) | id83ud84ufje73h skd93hr5ghs83j | md5(magic_num + '' + amount + payment_method + pirate_token + notify_url) |
<br>

## 4) Get payment status<br>
Description: When the payment has been recieved or updated, Our system will make a POST call to the provided "notify_url" with the payment status. In the event when the user wants to check the transaction status, this call can be used to get the status of the specific transaction. The call takes in the `payment_token` as a parameter and will return with a status. User will be able to view the trasaction details in the Admin Console.<br>
URL: https://api.one-piece.us/payment/status/{pirate_token}/{payment_token}/{magic_num}/{signature}<br>
Method: GET

| Parameters | Description |
| --- | --- |
| pirate_token | This value can be found in the Admin Console |
| payment_token | This token can be found in the return response from the initiate payment method above - `#3` |
| magicNum | One random number |
| signature | md5(magic_num + payment_token) |

<br><br>

# Reference
Admin Console: https://admin.one-piece.us<br/>
React Demo: http://demo.one-piece.us/<br/>
Demo Repo: https://github.com/onepiece-payment/react-demo<br/>
Questions: onepiece.payment@gmail.com

