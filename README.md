# Ethereum state channel for GEO protocol

The state channel that enables instant ETH payments between two nodes with Ethereum blockchain accounts. It completely fits GEO protocol payments mechanism. 

# todo

For more information about usage state channels and crosschain payments in protocol please visit:

https://github.com/HaySayCheese/EthSC_GEO_ETHBerlin

## Setup

1. `npm install truffle -g`

2. `npm install ganache-cli` for deployment and test in test-rpc

3. Also for deploy in `rinkeby` testnet you need to create file `test_private_key` in root with following content:

`module.exports.PRIVATE = "use_your_private_here";`

4. `npm install`

5. `truffle migrate --network infura_rinkeby` for deployment in `rinkeby` testnet. Also you may deploy in testrpc by specifying `--network ganache`

## Usage

# todo
