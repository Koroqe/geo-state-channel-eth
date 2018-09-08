/*
    File 'test_private_key.js' should be created in root directory.

    export default function getPrivate() {
        return "0x32129c03c654c24814c2bb730e556fc79e1024505addb231a22536d18c142a7"
    }
 */

import getPrivate from './test_private_key';

const PrivateKeyProvider = require('truffle-privatekey-provider');
const privateKey = getPrivate();

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
            provider: _ => new PrivateKeyProvider(privateKey, `https://rinkeby.infura.io/`),
            network_id: '*',
            gas: highGas
        },
    }
};
