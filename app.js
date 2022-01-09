const algosdk = require('algosdk');
const { mnemonic, approvalSource, clearSource } = require("./constant");

// client init
const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
const port = '';
const token = {
  'X-API-Key': 'bUemI5ZIty4XI3s7hxZ785dUdxvWhV9wJXOySBK8'
}
const algodClient = new algosdk.Algodv2(token, baseServer, port);

const contractReadFunc = async () => {
  const { addr: senderAddress } = algosdk.mnemonicToSecretKey(mnemonic);
  readGlobalState(algodClient, senderAddress, 57287538);
}

const contractUpdateFunc = async () => {
  const { sk: senderPvtKey, addr: senderAddress } = algosdk.mnemonicToSecretKey(mnemonic);
  const params = await algodClient.getTransactionParams().do();
  // call application with arguments
  let args = []
  args.push(new Uint8Array(Buffer.from("Add")))
  console.log(Array.isArray(args));
  // create unsigned transaction
  let txn = algosdk.makeApplicationNoOpTxn(senderAddress, params, 57209087, args);
  let txId = txn.txID().toString();
  // Sign the transaction
  let signedTxn = txn.signTxn(senderPvtKey);
  console.log("Signed transaction with txID: %s", txId);
  // Submit the transaction
  let sendTx = await algodClient.sendRawTransaction(signedTxn).do();
  console.log(sendTx);
}

const deployContract = async () => {
  // get account from mnemonic
  const { sk: senderPvtKey, addr: senderAddress } = algosdk.mnemonicToSecretKey(mnemonic);
  const compiledApprovalContract = await algodClient.compile(approvalSource).do();
  const compiledClearContract = await algodClient.compile(clearSource).do();
  // get node suggested parameters
  const params = await algodClient.getTransactionParams().do();
  // declare onComplete as NoOp
  // onComplete = algodClient.OnApplicationComplete.NoOpOC;
  // create unsigned transaction
  const txn = algosdk.makeApplicationCreateTxnFromObject({
    suggestedParams: {
      ...params,
    },
    from: senderAddress,
    numLocalByteSlices: 4,
    numGlobalByteSlices: 2,
    numLocalInts: 0,
    numGlobalInts: 2,
    approvalProgram: new Uint8Array(Buffer.from(compiledApprovalContract.result, "base64")),
    clearProgram: new Uint8Array(Buffer.from(compiledClearContract.result, "base64")),
    onComplete: 0,
  });
  const signedTxn = algosdk.signTransaction(txn, senderPvtKey);
  let sendTx = await algodClient.sendRawTransaction(signedTxn.blob).do();
  console.log(sendTx);
  // get appId by txId
}

// read local state of application from user account
async function readLocalState(client, account, appId) {
  let accountInfoResponse = await client.accountInformation(account).do();
  for (let i = 0; i < accountInfoResponse['created-apps'].length; i++) {
    if (accountInfoResponse['created-apps'][i].id == appId) {
      // console.log(accountInfoResponse['created-apps'][i])
      console.log("User's local state:");
      for (let n = 0; n < accountInfoResponse['created-apps'][i]['params']['global-state'].length; n++) {
        console.log(accountInfoResponse['created-apps'][i]['params']['global-state'][n]);
      }
    }
  }
}

// read global state of application
async function readGlobalState(client, account, index) {
  let accountInfoResponse = await client.accountInformation(account).do();
  for (let i = 0; i < accountInfoResponse['created-apps'].length; i++) {
    if (accountInfoResponse['created-apps'][i].id == index) {
      // console.log(accountInfoResponse['created-apps'][i])
      console.log("Application's global state:");
      for (let n = 0; n < accountInfoResponse['created-apps'][i]['params']['global-state'].length; n++) {
        console.log(accountInfoResponse['created-apps'][i]['params']['global-state'][n]);
      }
    }
  }
}


deployContract()
// contractReadFunc()
// contractUpdateFunc()