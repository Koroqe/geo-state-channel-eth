const GeoEthChannels = artifacts.require('GeoEthChannels');

module.exports = (deployer, network, accounts) => {

    return deployer
        .then(_ => deployer.deploy(JobQueueLib))
        .catch(console.error);
};
