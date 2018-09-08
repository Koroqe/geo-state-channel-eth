const GeoEthChannels = artifacts.require('GeoEthChannels');

module.exports = (deployer, network, accounts) => {

    deployer.deploy(GeoEthChannels)
        .catch(console.error);
};
