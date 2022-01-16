const Web3 = require("web3");
const { abi } = require("./constant");
const web3 = new Web3('wss://api.avax-test.network/ext/bc/C/ws');

const CONTRACT_ADDRESS = '0x1c19ad41f7655c123a198a3b218db73579dc3874';

let subscription = web3.eth.subscribe('logs',{address: CONTRACT_ADDRESS, topics: ['0x6692a32e3c0b2ac8a3351135b03e3c90b5612962209590e19dc8cd99b63a25a5']},(err,result) => {
    if(result)
        console.log('success',result);
    var check = web3.eth.abi.decodeLog(result.data)
    console.log(check)
})

subscription.on('data', event => console.log(event))
subscription.on('changed', changed => console.log(changed))
subscription.on('error', err => { console.log(err) })
subscription.on('connected', nr => console.log(nr))

