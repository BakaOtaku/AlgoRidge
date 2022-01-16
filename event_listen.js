const Web3 = require("web3");
const { abi } = require("./constant");
const web3 = new Web3('wss://api.avax-test.network/ext/bc/C/ws');

const CONTRACT_ADDRESS = '0x0B28710202312b3f8b319eF966CaA50c41CaaF38';

let subscription = web3.eth.subscribe('logs',{address: CONTRACT_ADDRESS},(err,result) => {
    if(result)
        console.log('success',result);
    console.log(web3.utils.hexToAscii(result.topics[2]))
})

subscription.on('data', event => console.log(event))
subscription.on('changed', changed => console.log(changed))
subscription.on('error', err => { console.log(err) })
subscription.on('connected', nr => console.log(nr))



// console.log(web3.utils.hexToUtf8(`0x6096709a27e23a8c6259d2f1e49a93ac3dcfe20e6dc7b9ae8822deb0025ffe16`))