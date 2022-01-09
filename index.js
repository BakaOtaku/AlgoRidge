const algosdk = require('algosdk');


const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
const port = '';
const token = {
    'X-API-Key': 'bUemI5ZIty4XI3s7hxZ785dUdxvWhV9wJXOySBK8'
}
const algodClient = new algosdk.Algodv2(token, baseServer, port);

const createAccount = function () {
    try {
        const myaccount = algosdk.generateAccount();
        console.log("Account Address = " + myaccount.addr);
        let account_mnemonic = algosdk.secretKeyToMnemonic(myaccount.sk);
        console.log("Account Mnemonic = " + account_mnemonic);
        console.log("Account created. Save off Mnemonic and address");
        console.log("Add funds to account using the TestNet Dispenser: ");
        console.log("https://dispenser.testnet.aws.algodev.network/ ");
        return myaccount;
    }
    catch (err) {
        console.log("err", err);
    }
};

async function transfer() {
    let { sk: senderPvtKey, addr: senderAddress } = algosdk.mnemonicToSecretKey("that like gadget usage heart when south frame warm knife decade law siren brief much stadium stuff spatial tumble vote man drastic region abstract kind");

    const feePerByte = 10;
    const firstValidRound = 1000;
    const lastValidRound = 2000;
    const { addr: closeAssetsToAddr } = algosdk.generateAccount();
    const { addr: receiverAddr } = algosdk.generateAccount();
    const amount = 10; // amount of assets to transfer


    // set suggested parameters
    // in most cases, we suggest fetching recommended transaction parameters
    // using the `algosdk.Algodv2.getTransactionParams()` method
    const suggestedParams = await algodClient.getTransactionParams().do();
    // create the asset transfer transaction

    let txn = algosdk.makePaymentTxnWithSuggestedParams(senderAddress, receiverAddr, 1000000, undefined, undefined, await algodClient.getTransactionParams().do());


    const signedTxn = algosdk.signTransaction(txn,senderPvtKey);
    let sendTx = await algodClient.sendRawTransaction(signedTxn.blob).do();

    console.log("Transaction : " + sendTx.txId);
}

async function contractInteract() {
    const approvalSource = `
    #pragma version 5
    txn ApplicationID
    int 0
    ==
    bnz main_l18
    txn OnCompletion
    int OptIn
    ==
    bnz main_l17
    txn OnCompletion
    int CloseOut
    ==
    bnz main_l16
    txn OnCompletion
    int UpdateApplication
    ==
    bnz main_l15
    txn OnCompletion
    int DeleteApplication
    ==
    bnz main_l14
    txn OnCompletion
    int NoOp
    ==
    bnz main_l7
    err
    main_l7:
    global GroupSize
    int 1
    ==
    txna ApplicationArgs 0
    byte "Add"
    ==
    &&
    bnz main_l13
    global GroupSize
    int 1
    ==
    txna ApplicationArgs 0
    byte "Deduct"
    ==
    &&
    bnz main_l10
    err
    main_l10:
    byte "Count"
    app_global_get
    store 0
    load 0
    int 0
    >
    bnz main_l12
    main_l11:
    int 1
    return
    main_l12:
    byte "Count"
    load 0
    int 1
    -
    app_global_put
    b main_l11
    main_l13:
    byte "Count"
    app_global_get
    store 0
    byte "Count"
    load 0
    int 1
    +
    app_global_put
    int 1
    return
    main_l14:
    int 0
    return
    main_l15:
    int 0
    return
    main_l16:
    int 0
    return
    main_l17:
    int 0
    return
    main_l18:
    byte "Count"
    int 0
    app_global_put
    int 1
    return
    `
    const clearSource = `
    #pragma version 5
    int 1
    return
    `
    let { sk: senderPvtKey, addr: senderAddress } = algosdk.mnemonicToSecretKey("that like gadget usage heart when south frame warm knife decade law siren brief much stadium stuff spatial tumble vote man drastic region abstract kind");
    // const compiledApprovalContract = await algodClient.compile(approvalSource).do();
    // const compiledClearContract = await algodClient.compile(clearSource).do();
    // const params = await algodClient.getTransactionParams().do();
    // const txn = algosdk.makeApplicationCreateTxnFromObject({
    //     suggestedParams: {
    //         ...params,
    //     },
    //     from: senderAddress,
    //     numLocalByteSlices: 4,
    //     numGlobalByteSlices: 2,
    //     numLocalInts: 0,
    //     numGlobalInts: 2,
    //     approvalProgram: new Uint8Array(Buffer.from(compiledApprovalContract.result, "base64")),
    //     clearProgram: new Uint8Array(Buffer.from(compiledClearContract.result, "base64")),
    //     onComplete: 0,
    // });
    // const signedTxn = algosdk.signTransaction(txn,senderPvtKey);
    // let sendTx = await algodClient.sendRawTransaction(signedTxn.blob).do();
    // console.log(sendTx)


    const info = algodClient.accountInformation(senderAddress)
    const quer = info.path()
    console.log(quer)
}

// transfer()
// contractInteract()
createAccount()



/*
Account Address = 5LKELXU64DSLMRGAFN2GOSKZSZVAJF4FII6RSRZQYXWLBC7OLAHZENUBHU
Account Mnemonic = that like gadget usage heart when south frame warm knife decade law siren brief much stadium stuff spatial tumble vote man drastic region abstract kind
Account created. Save off Mnemonic and address
Add funds to account using the TestNet Dispenser:
https://dispenser.testnet.aws.algodev.network/


Account Address = 2NLGJCLSDMLSKQBHKWTP4HIUCGZUX5EFJ56PCONWLS6GAMSXG62JYEDBKE
Account Mnemonic = hurt hub gentle fix inmate goat first traffic armed enlist step excess swamp trust fan shrimp frost spring lunar call castle long top absorb creek

*/