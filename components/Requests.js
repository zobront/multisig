import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useEthereum } from "../providers/EthereumProvider"
import { useContract } from "../providers/ContractProvider"
import { Segment, Grid, Form, Button, Divider } from 'semantic-ui-react'

import Request from './Request'

const Requests = ({setStatus, sigsNeeded}) => {

	const [openRequests, setOpenRequests] = useState();

	const { provider, signer, address } = useEthereum();
	const { contracts } = useContract();
	const { multisig } = contracts;

	useEffect(async() => {
		if (multisig) {
			let requestArrays = [];
			const requestCount = await multisig.nextRequestId();
			for (let i = requestCount - 1; i >= 0; i--) {
				const first = await multisig.requests(i)
				requestArrays.push(first)
			}
			setOpenRequests(requestArrays)
		}
	}, [contracts])

	const makeRequest = async (e) => {
		e.preventDefault;
		const eth = e.target[0].value;
		const account = e.target[1].value;
		setStatus('loading')
		const tx = await multisig.connect(signer).makeRequest(account, ethers.utils.parseEther(eth));
		await tx.wait()
		setStatus('ready')
		e.target[0].value = '';
		e.target[1].value = '';
	}

	const castVote = async (id) => {
		setStatus('loading')
		try {
			const tx = await multisig.connect(signer).vote(id);
			await tx.wait()	
		} catch (err) {
			console.log(err)
		}
		setStatus('ready')	
	}

	const execute = async (id) => {
		setStatus('loading')
		try {
			const tx = await multisig.connect(signer).execute(id)
			await tx.wait()	
		} catch (err) {
			console.log(err)
		}
		setStatus('ready')
	}

	return (
		<>
			<h2>User Actions</h2>
			<Segment placeholder>
	          <Grid columns={2} divided>
	            <Grid.Column style={{textAlign: "center"}}>
	              <h3>Make a Withdrawal Request</h3>
	              <Form onSubmit={makeRequest}>
	                <Form.Field>
	                  <input placeholder="ETH to withdraw" />
	                </Form.Field>
	                <Form.Field>
	                  <input placeholder="Address to send" />
	                </Form.Field>
	                <Button type='submit' primary>Make Request</Button>
	              </Form>
	            </Grid.Column>

	            <Grid.Column style={{textAlign: "center"}}>
	              <h3>Open Requests</h3>
	              {openRequests ? openRequests.map(request => {
	              	return (<Request key={request.id} request={request} castVote={castVote} execute={execute} sigsNeeded={sigsNeeded} />)
	              }) : ''}
	            </Grid.Column>
	          </Grid>
	        </Segment>
	    </>
	)
};


export default Requests;	