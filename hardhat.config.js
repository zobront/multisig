require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');

const INFURA_URL = 'INSERT INFURA URL HERE';
const RINKEBY_PRIVATE_KEY = 'INSERT PRIVATE KEY HERE';

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: INFURA_URL,
      accounts: [`0x${RINKEBY_PRIVATE_KEY}`]
    }
  }
}