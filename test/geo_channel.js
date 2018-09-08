const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'ws://localhost:7546');

const GeoEthChannels = artifacts.require("GeoEthChannels");

contract ('GeoEthChannels', accounts => {

    const deployer = accounts[0];
    const alice = accounts[1];
    const bob = accounts[2];

    let channelID = web3.utils.soliditySha3(alice, bob);
    console.log("ChannelID: " + channelID);

    let channelsContract;

    before('setup', async () => {
        channelsContract = await GeoEthChannels.new({from: deployer});
        console.log("Alice: " + alice);
        console.log("Bob: " + bob);
    });

    //should create a channel

    describe('Channel opening', () => {


        console.log("channelID: " + channelID);

        it('should correctly create channel', async() => {

            await channelsContract.openChannel(bob, {from: alice, value: 999999});

            let details = await channelsContract.getChannelDetails.call(channelID);
            console.log("Details: " + details);
        });

        it('should correctly respond channel', async() => {

            await channelsContract.respondChannel(alice, {from: bob, value: 666666});

            let details = await channelsContract.getChannelDetails.call(channelID);
            console.log("Details: " + details);
        });

        it('should return correct values from created channels', async() => {

        });

        it('should calculate correct channelID', async() => {

        });
    });

    describe('Channel closing', () => {

        it('should correctly close channel immediately white cooperative close', async() => {

            /*

                bytes32 channelID,
                uint256 balanceAlice,
                uint256 balanceBob,
                bytes signatureAlice,
                bytes signatureBob

             */


            await channelsContract.cooperativeClose(channelID, );

        })
    })


    /*
    RECEIPT
    {
	"receipt_id":1,
	"epoch_id": 0,
	"amount": 100,
	"receiver_address": "0x95e465AeF5091AEf1CF3619678D0283F5E7B5586"
    }

    sig: 0xc5107900d84087b38f0cb8dcf14e4edbfb4a6514bc159de1bf75b54ae2c525843bcf8f20a595f2e8bf580a085be902248a0177c5342e323b3874ff5918c14c331c

     */

});