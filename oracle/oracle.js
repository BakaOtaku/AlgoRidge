const Web3 = require("web3");
const algosdk = require('algosdk');
const { mnemonic, approvalSource, clearSource } = require("./constant");

// client init
const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
const port = '';
const token = {
  'X-API-Key': 'bUemI5ZIty4XI3s7hxZ785dUdxvWhV9wJXOySBK8'
}
const algodClient = new algosdk.Algodv2(token, baseServer, port);
const appId = 59547068;

const contractReadFunc = async () => {
  const { addr: senderAddress } = algosdk.mnemonicToSecretKey(mnemonic);
  readLocalState(algodClient, senderAddress, appId);
  readGlobalState(algodClient, senderAddress, appId);
}

const { abi } = require("./constant");
const web3 = new Web3('wss://api.avax-test.network/ext/bc/C/ws');

const CONTRACT_ADDRESS = '0x1c19ad41f7655c123a198a3b218db73579dc3874';

let subscription = web3.eth.subscribe('logs', { address: CONTRACT_ADDRESS, topics: ['0x6692a32e3c0b2ac8a3351135b03e3c90b5612962209590e19dc8cd99b63a25a5'] }, (err, result) => {
  if (result)
    console.log('success', result);
  var check = web3.eth.abi.decodeLog(result.data)
  releasePayment(check)
  console.log(check)
})

subscription.on('data', event => console.log(event))
subscription.on('changed', changed => console.log(changed))
subscription.on('error', err => { console.log(err) })
subscription.on('connected', nr => console.log(nr))



const releasePayment = async (amount, reciever) => {
  const { sk: senderPvtKey, addr: senderAddress } = algosdk.mnemonicToSecretKey(mnemonic);
  const params = await algodClient.getTransactionParams().do();
  // call application with arguments
  let args = []
  args.push(new Uint8Array(Buffer.from("releasePayment")))
  args.push(new Uint8Array(Buffer.from(amount)))
  args.push(new Uint8Array(Buffer.from(reciever)))


  // create unsigned transaction
  let txn = algosdk.makeApplicationOptInTxn(senderAddress, params, appId, args);
  let txId = txn.txID().toString();

  // Sign the transaction
  let signedTxn = txn.signTxn(senderPvtKey);
  console.log("Signed transaction with txID: %s", txId);
  try {
    // Submit the transaction
    let sendTx = await algodClient.sendRawTransaction(signedTxn).do();
    console.log(sendTx);
  } catch (err) {
    console.log(err);
  }
}