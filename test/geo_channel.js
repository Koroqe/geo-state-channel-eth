const Web3 = require('web3');
const web3 = new Web3('ws://localhost:7545');

const GeoEthChannels = artifacts.require("GeoEthChannels");

contract ('GeoEthChannels', accounts => {

    const deployer = accounts[0];
    const alice = accounts[1];
    const bob = accounts[2];


    let channelID = web3.utils.soliditySha3(alice, bob);

    console.log("Alice: " + alice);
    console.log("Bob: " + bob);
    console.log("ChannelID: " + channelID);

    let channelsContract;

    before('setup', async () => {
        channelsContract = await GeoEthChannels.new({from: deployer});

    });

    //should create a channel

    describe('Channel opening', () => {

        let alicesDeposit = 999999;
        let bobsDeposit = 666666;

        it('should correctly create channel', async() => {

            await channelsContract.openChannel(bob, {from: alice, value: alicesDeposit});

            let details = await channelsContract.getChannelDetails.call(channelID);
            console.log("Details: " + details);
        });

        it('should correctly respond channel', async() => {

            await channelsContract.respondChannel(alice, {from: bob, value: bobsDeposit});

            let details = await channelsContract.getChannelDetails.call(channelID);
            console.log("Details: " + details);
        });

        it('should return correct values from created channels', async() => {

            let details = await channelsContract.getChannelDetails.call(channelID);

            assert.equal(details.alice, alice.address, 'Facilitator address should be alice"s address');
            assert.equal(details.bob, bob.address, 'Receiver address should be bob"s address');
            assert.equal(details[2].toString(), 2, 'Channel"s state should be "Bidirectional"');
            assert.equal(details[3].toString(), alicesDeposit, 'Alise"s deposit should fit');
            assert.equal(details[4].toString(), bobsDeposit, 'Bob"s deposit should fit');
        });

        it('should calculate correct channelID', async() => {

        });
    });

    describe('Channel closing', () => {

        it('should correctly close channel immediately while cooperative close', async() => {

            /*
                "bob_amount": 555,
	            "alice_amount": 1000,
	            "channel_id": "0xdd94461464c6205717f7e4aa66a658e0d64babd73d36aeb214b16377663e563d"
             */

            let aliceWithdrawAmount = 1000;
            let bobWithdrawAmount = 555;

            showBalancesAB();

            let aliceSig = "0xf9ec643079c1aa02194e7a2dec3587ac6048f025abf082451d67f764575c123c618e77343632daf404bb77d010130b08e7be07f617e9434884106927c42468841b";
            let bobSig = "0x51f02b5230da4af322b427f16ba3ffa09d41018e6208e305834e118b4ddb1fb96ce4e5ac9fc9dd082ccca5442f9d41b8632e10615caa5c41b0261d898a25be361b";

            await channelsContract.cooperativeClose(channelID, aliceWithdrawAmount, bobWithdrawAmount, aliceSig, bobSig);

            let details = await channelsContract.getChannelDetails.call(channelID);
            console.log("Details: " + details);

            showBalancesAB()
        })
    });


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

    function showBalancesAB() {
        const aliceBalance = web3.eth.getBalance(alice).then(
            aliceBalance => {
                console.log("Alice's balance: " + aliceBalance.toString());
            }
        );
        const bobBalance = web3.eth.getBalance(bob).then(
            bobBalance => {
                console.log("Bob's balance: " + bobBalance.toString());
            }
        );
    }
});