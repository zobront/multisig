import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useEthereum } from "../providers/EthereumProvider"
import { useContract } from "../providers/ContractProvider"
import { Segment, Grid, Form, Button, Divider } from 'semantic-ui-react'

const Deposit = ({setStatus}) => {
	const [owner, setOwner] = useState();
	const [balance, setBalance] = useState();

	const { provider, signer, address } = useEthereum();
	const { contracts } = useContract();
	const { multisig } = contracts;

	useEffect( async () => {
		if (multisig) {
		  const ownerAddress = await multisig.admin();
		  setOwner(ownerAddress);

		  const multisigBalance = await provider.getBalance(multisig.address);
		  setBalance(ethers.utils.formatEther(multisigBalance));
		}
	}, [contracts])

	const deposit = async (e) => {
		e.preventDefault;
		const eth = e.target[0].value
		setStatus('loading')
		const tx = await signer.sendTransaction({to: multisig.address, value: ethers.utils.parseEther(eth)})
		await tx.wait()
		setStatus('ready')
	}

	return (
		<Segment placeholder>
        <Grid columns={2} divided>
          <Grid.Column style={{textAlign: "center"}}>
          	<h3>Multisig Facts</h3>
          	<p>Address: {multisig ? multisig.address : ''}</p>
		        <p>Owner: {owner}</p>
		        <p>Balance: Ξ {balance ? (parseInt(balance * 100) / 100).toFixed(2) : ''}</p>
          </Grid.Column>

          <Grid.Column style={{textAlign: "center"}}>
						<h3>Make a Deposit</h3>
						<Form onSubmit={deposit}>
							<Form.Field>
							  <input placeholder="ETH to deposit" />
							</Form.Field>
							<Button type='submit' primary>Deposit</Button>
						</Form>
        </Grid.Column>
      </Grid>
    </Segment>
	)
};


export default Deposit;	