# Ethereum state channel for GEO protocol

The state channel that enables instant ETH payments between two nodes with Ethereum blockchain accounts. It completely fits GEO protocol payments algorythm. 

The channel has 5 main states: `Uninitialized, Unidirectional, Bidirectional, Settled, Closed`

The channel lifecycle is as follows:

1. After channel has been opened, it allows both parties to create receipts of payments and after reaching limit they make audit message, that confirm balance changes in channel. It means that current channel epoch is finalized and it settlement closing balances could be easily proved with message.

<p align="center">
  <img width="45%" height="35%" src="https://github.com/Koroqe/geo-state-channel-eth/blob/master/images/Screenshot_11.png">
</p>

2. During the channel usage it will constantly increases channel epoch. Channel settlement also allowed with receipts, which not exceeds current commited channel epoch. In this case both participants should provide their receipts (still in development) and they will able to withdraw balances after locktime period. Unless they sign cooperative close message and commit it in contract.

![State_channel_lifecycle2](https://github.com/Koroqe/geo-state-channel-eth/blob/master/images/Screenshot_9.png)

3. By closing channel after settlement timeout or immediately after cooperative close commitment parties receive their funds from state channel in the same amounts as they proved. After channel closing it could not be used, but can be reopened with new balances.

![State_channel_lifecycle3](https://github.com/Koroqe/geo-state-channel-eth/blob/master/images/Screenshot_10.png)

Presentation link: https://docs.google.com/presentation/d/1HNhj0JxOa-g0GmBpJx7jy8rIV23onR6hpLEGkyVwil4/edit?usp=sharing

## Setup

1. `npm install truffle -g`

2. `npm install ganache-cli` for deployment and test in test-rpc

3. Also for deploy in `rinkeby` testnet you need to create file `test_private_key` in root with following content:

`module.exports.PRIVATE = "use_your_private_here";`

4. `npm install`

5. `truffle migrate --network infura_rinkeby` for deployment in `rinkeby` testnet. Also you may deploy in testrpc by specifying `--network ganache`

## Usage

For more information about usage state channels and crosschain payments in protocol please visit:

https://github.com/HaySayCheese/EthSC_GEO_ETHBerlin

## Contract in live net

Deployed contract in Rinkeby testnet:

`0x4b37635bde74f27f28c9dc6d7e2f6584289d248c`
