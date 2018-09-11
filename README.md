# how to start
 
 * Run `npm install op-sdk --save` to install the latest private package. 
 

# demo usage

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
  });

  //sample route to get available payment methods
  router.get('/methods', async (req, res) => {

      const getAvailableMethods = await newMerchant.getAvailablePayments();
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

      const gotStatus = await newMerchant.goGetPaymentStatus('paymentToken');
      res.render('index', { title: "Got Payment Status", data: [gotStatus.status, gotStatus.payload.payment_status.message });

  });

  module.exports = router;
```

# how does op-sdk work

This package is publicly available for anyone to install. However, you will need to sign up an account with One-Piece in order to be able to use our service. With this sdk and your One-Piece account, you will be able to get available payment methods, initate payments and check status of a specific transaction. 

Available methods:

*1) `.getAvailablePayments()`
This function will be used when the user needs to get the list of available payment methods. The system will respond with an array of payment methods our service can provide.*

*2) `.initiatePayment()`
This function will be used to initiate a payment transaction. The function takes in an object called `options` as a parameter (See `options` example above). If the transaction is initiated properly, it will connect to One-Piece and create a payment transaction in our system. The user will be able to view the transaction details in the Admin Console.*

*3) `.goGetPaymentStatus()`
When the payment has been recieved or updated, One-Piece will send the status to the provided notify_url. In the event when the user wants to check the transaction status, this call can be used to get the status of the specific transaction. The call takes in the `paymentToken` as a parameter and will return with a status. User will be able to view the trasaction details in the Admin Console.*

Admin Console: https://admin.one-piece.us<br/>
Questions: onepiece.payment@gmail.com
