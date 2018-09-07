var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

contract ('RemmeBridge', accounts => {

    acct = web3.account.create('LALALA LALA');

    message_hash = keccak256(
        keccak256(
            'string message_id',
            'address sender',
            'uint32 block_created',
            'uint192 balance',
            'address contract'
        ),
        keccak256(
            'Receiver closing signature',
            _sender_address,
            _open_block_number,
            _balance,
            address(this)
        )
    );

    console.log(web3.eth.personal.sign(message_hash, acct.address, ''));
    console.log(web3.utils.hexToBytes(hex))

});