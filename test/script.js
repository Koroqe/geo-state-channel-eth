const Web3 = require('web3');
const web3 = new Web3;
provider = new Web3.providers.WebsocketProvider('ws://localhost:7545');
web3.setProvider(provider);

acct = web3.eth.accounts.create('LALALA LALA');
console.log(acct.privateKey + " " + acct.address)

message_hash = web3.utils.sha3(
    web3.utils.sha3(
        'string message_id',
        'address sender',
        'uint32 block_created',
        'uint192 balance',
        'address contract'
    ),
    web3.utils.sha3(
        'Receiver closing signature',
        "0x0000000000000000000000000000000000000000",
        1,
        1,
        acct.address
    )
);

let message = acct.sign(message_hash);
let sig = message.signature;

console.log(sig);
let sigBytes = web3.utils.hexToBytes(sig);
console.log(sigBytes);
console.log(sigBytes.length);

