const PrivateKeyProvider = require('truffle-privatekey-provider');

const privateKey = process.env.ACCOUNT_PRIVATE_KEY;

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!

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
            provider: _ => new PrivateKeyProvider(privateKey, `https://rinkeby.infura.io/`),
            network_id: '*',
            gas: highGas
        },
    }
};
