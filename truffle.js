const PrivateKeyProvider = require('truffle-privatekey-provider');
const {PRIVATE} = require('./test_private_key');
/*
    For correct work file 'test_private_key.js' should be created in root directory with following:

    module.exports.PRIVATE = "use_your_private_key_here";
*/

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>

    networks: {
        dev: {
            host: 'localhost',
            port: 8545,
            network_id: '*' // match any network
        },
        ganache: {
            host: 'localhost',
            port: 7545,
            network_id: '*',
            gas: 76000000
        },
        infura_rinkeby: {
            provider: _ => new PrivateKeyProvider(PRIVATE, `https://rinkeby.infura.io/`),
            network_id: '*'
        },
    }
};
