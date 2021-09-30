# Multisig Wallet with DAO Voting to Release Funds

This is a minimal multisig wallet setup with a basic front end.

- The creator of the contract is added as the first signer
- Anyone can deposit to the wallet
- Additional signers can be added or removed by the owner
- The number of signatures required to approve a transaction can be updated
- Anyone can make a withdrawal request
- Signers can vote on the request
- Once the threshold of votes has been hit, anyone can execute the transaction

Currently connected contract `0xEFd9bff2E93cFe15269eF0A4aE2F6330998cc672` deployed on Rinkeby. To update, add your Infura URL and private keys to the Hardhat config file, call `npm run deploy:rinkeby` to deploy, and add the new contract address to `providers/ContractProvider.js`.