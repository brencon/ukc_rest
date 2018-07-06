'use strict'
/**
 * This is a simple program that demonstrates the use of UKC REST Api
 * It will connect to a UKC server, create a new RSA key, list all keys, and then list info on a specific key.
 */
const UkcCryptoApi = require('ukc_crypto_api');
const defaultClient = UkcCryptoApi.ApiClient.instance;
// set server base url here
defaultClient.basePath = 'https://<servername>:<port>'; // make sure you use your UKC url and port

// This is required if your server is using a self signed certificate
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// Configure HTTP basic authorization: basicAuth
var basicAuth = defaultClient.authentications['basicAuth'];
const DEFAULT_PASSWORD = '<password here>;'; // use your password here
basicAuth.username = 'username@partition'; // use your username and partition here. so@root is a built-in default user for root
basicAuth.password = DEFAULT_PASSWORD;

//Setup for connection using client certificate.
const fs = require('fs');
const https = require('https');
const requestAgent = new https.Agent();
requestAgent.options.pfx = fs.readFileSync('c:/path/to/pfx/here.pfx'); //Path to UKC Client Certificate
requestAgent.options.passphrase = "<password to pfx>"; //PFX Password here.
defaultClient.requestAgent = requestAgent;

//Setup for logging
const log = (text) => console.log(text);

//Instance of KeysApi so that we can use generateKey.
var apiInstance = new UkcCryptoApi.KeysApi();

async function genkey() {
  
  //generate RSA key
  const newRSAKey = 'MyTestKey';
  log(`Creating Key '${newRSAKey}'`);
  try{
    await apiInstance.generateKey(
    {
    body: {
      keyId: newRSAKey,
      keyFormat: {
         type: "RSA",
         size: 2048     
      },
      keyProperties: {
        supportedOperations: ["SIGN","DECRYPT"],
        description: "Description of Key Goes Here!"
      }
    }
  })
  log(`Key ${newRSAKey} created Successfully`)
 }catch(e){
   if(e.status === 409) {
     log(`Key ${newRSAKey} already exists`);
   }else{
     throw e;
   }
 }
 //List all Keys in Partition
 let keys = await apiInstance.listKeys('<partition name here>');
 log(keys);

 //Get Info on Specific Key
 let getTheKey = await apiInstance.getKeyInfo('<unique ID of key>')
 log(getTheKey);
}

genkey()
.then(() => log(`All done!`))
.catch(e => {
  log(e);
})


