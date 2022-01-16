const algosdk = require('algosdk');
const { mnemonic, approvalSource, clearSource } = require("./constant");

// client init
const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
const port = '';
const token = {
  'X-API-Key': 'bUemI5ZIty4XI3s7hxZ785dUdxvWhV9wJXOySBK8'
}
const algodClient = new algosdk.Algodv2(token, baseServer, port);
const appId = 57853493;

const contractReadFunc = async () => {
  const { addr: senderAddress } = algosdk.mnemonicToSecretKey(mnemonic);
  readLocalState(algodClient, senderAddress, appId);
  readGlobalState(algodClient, senderAddress, appId);
}

const setupdev = async () => {
  const { sk: senderPvtKey, addr: senderAddress } = algosdk.mnemonicToSecretKey(mnemonic);
  const params = await algodClient.getTransactionParams().do();
  // call application with arguments
  let args = []
  args.push(new Uint8Array(Buffer.from("setupdev")))
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

// # site https://v2.cryptii.com/base64/decimal
// function readInt(array) {
//     var value = 0;
//     for (var i = 0; i < array.length; i++) {
//         value = (value * 256) + array[i];
//     }
//     return value;
// }
// readInt([0, 0, 0, 0, 0, 15, 66, 64])

// setupdev()
const useBridge = async () => {
  const { sk: senderPvtKey, addr: senderAddress } = algosdk.mnemonicToSecretKey(mnemonic);
  const params = await algodClient.getTransactionParams().do();
  // call application with arguments
  let args = []
  // args.push(new Uint8Array(Buffer.from("setupdev")))
  args.push(new Uint8Array(Buffer.from("useBridge")))
  args.push(new Uint8Array(Buffer.from("0x0197d7FaFCA118Bc91f6854B9A2ceea94E676585")))
  // create unsigned transaction
  let txn1 = algosdk.makeApplicationNoOpTxn(senderAddress, params, appId, args);
  // let txId = txn.txID().toString();

  const appAddress = algosdk.getApplicationAddress(appId);
  const txn2 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: senderAddress,
    to: appAddress,
    amount: algosdk.algosToMicroalgos(1),
    suggestedParams: params,
  });

  // assign group id to transactions
  algosdk.assignGroupID([txn1, txn2]);

  // sign transactions
  const stxn1 = txn1.signTxn(senderPvtKey);
  const stxn2 = txn2.signTxn(senderPvtKey);

  // send transactions (note that the accounts need to be funded for this to work)
  console.log('Sending transactions...');
  const { txId } = await algodClient.sendRawTransaction([stxn1, stxn2]).do();
  console.log(txId);

  // wait for confirmation – timeout after 2 rounds
  console.log('Awaiting confirmation (this will take several seconds)...');
  // const roundTimeout = 2;
  // await utils.waitForConfirmation(algodClient, txId, roundTimeout);
  console.log('Transactions successful.');

  // Sign the transaction
  // let signedTxn = txn.signTxn(senderPvtKey);
  // console.log("Signed transaction with txID: %s", txId);
  // try {
  //   // Submit the transaction
  //   let sendTx = await algodClient.sendRawTransaction(signedTxn).do();
  //   console.log(sendTx);
  // } catch (err) {
  //   console.log(err);
  // }
}
// useBridge()

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
  for (let i = 0; i < accountInfoResponse['apps-local-state'].length; i++) {
    if (accountInfoResponse['apps-local-state'][i].id == appId) {
      console.log(accountInfoResponse['apps-local-state'][i])
      console.log("User's local state:");
      // for (let n = 0; n < accountInfoResponse['apps-local-state'][i]['params']['global-state'].length; n++) {
      //   console.log(accountInfoResponse['apps-local-state'][i]['params']['global-state'][n]);
      // }
    }
  }
}

// read global state of application
async function readGlobalState(client, account, index) {
  let accountInfoResponse = await client.accountInformation(account).do();
  for (let i = 0; i < accountInfoResponse['created-apps'].length; i++) {
    if (accountInfoResponse['created-apps'][i].id == index) {
      console.log(accountInfoResponse['created-apps'][i])
      console.log("Application's global state:");
      // for (let n = 0; n < accountInfoResponse['created-apps'][i]['params']['global-state'].length; n++) {
      //   console.log(accountInfoResponse['created-apps'][i]['params']['global-state'][n]);
      // }
    }
  }
}


deployContract()
// contractReadFunc()
// contractUpdateFunc()


// Bridge Logic
// if useBridge - trigger bot
//   -  reciever, amount
// releasePayment payment
//  -  sender, amount on solidity


// UI side 
// - Add liquidity - addliquidity (amount from wallet)
// - Remove liquidity - removeliquidity (amount from wallet)
// - Bridge to algorand trigger bot 
