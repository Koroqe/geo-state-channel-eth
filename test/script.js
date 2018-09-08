const Web3 = require('web3');
const web3 = new Web3;
provider = new Web3.providers.WebsocketProvider('ws://localhost:7545');
web3.setProvider(provider);

acct = web3.eth.accounts.privateKeyToAccount("0x3a1076bf45ab87712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe266");
console.log(acct.privateKey + " " + acct.address);

// message_hash = web3.utils.sha3(
//     web3.utils.sha3(
//         'string message_id',
//         'address sender',
//         'uint32 block_created',
//         'uint192 balance',
//         'address contract'
//     ),
//     web3.utils.sha3(
//         'Receiver closing signature',
//         "0x0000000000000000000000000000000000000000",
//         1,
//         1,
//         acct.address
//     )
// );

message_hash = web3.utils.hexToBytes("0x69adc78af3b0a9d6ed9eaa93db40666990aeca08ff417dbbf39383f31020ea37");

let message = acct.sign(message_hash);
let sig = message.signature;

console.log(sig);
// let sigBytes = web3.utils.hexToBytes(sig);
// console.log(sigBytes);
// console.log(sigBytes.length);

