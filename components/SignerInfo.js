import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useEthereum } from "../providers/EthereumProvider"
import { useContract } from "../providers/ContractProvider"
import { Segment, Grid, Form, Button, Divider } from 'semantic-ui-react'

const SignerInfo = ({setStatus, sigsNeeded, setSigsNeeded}) => {
	const [signerCount, setSignerCount] = useState();
	const [isASigner, setIsASigner] = useState();

	const { provider, signer, address } = useEthereum();
	const { contracts } = useContract();
	const { multisig } = contracts;

	useEffect(async() => {
		if (multisig) {
			const count = await multisig.signerCount();
			setSignerCount(count.toNumber())
		}
	})

	const verifySigner = async (e) => {
		e.preventDefault;
		const address = e.target[0].value;
		try {
			const result = await multisig.isASigner(address);	
			setIsASigner(result)
		} catch (err) {
			console.log(err)
			setIsASigner(false)
		}
	}

	const updateSigsNeeded = async (e) => {
		e.preventDefault;
		const newSigs = e.target[0].value;
		const numSigners = await multisig.signerCount();
		if (newSigs > numSigners) {
			console.log('cant require more sigs than signers')
		} else {
			setStatus('loading')
			const tx = await multisig.connect(signer).updateSignaturesNeeded(newSigs);
			await tx.wait()
			setStatus('ready')
			setSigsNeeded(newSigs)
		}
	}

	const addSigner = async (e) => {
		e.preventDefault;
		const address = e.target[0].value;
		try {
			setStatus('loading')
			const tx = await multisig.connect(signer).addSigner(address);
			await tx.wait()
			setStatus('ready')
		} catch (err) {
			console.log(err)
		}
	}

	const removeSigner = async (e) => {
		e.preventDefault;
		const address = e.target[0].value;
		try {
			setStatus('loading')
			const result = await multisig.isASigner(address);	
			if (result) {
				const tx = await multisig.connect(signer).removeSigner(address);	
				await tx.wait()
			} else {
				console.log('They werent a signer to begin with!')
			}
			setStatus('ready')
		} catch (err) {
			console.log(err)
		}
		
	}

	return (
		<>
			<h2>Manage Signers</h2>
			<div className="subheader">
              <p>Current # of Signers: {signerCount}</p>
              <p>Signatures Needed for Withdrawal: {sigsNeeded}</p>
            </div>

			<Segment placeholder>
	          <Grid columns={2} divided>
	          	<Grid.Row style={{padding: "30px 0"}}>
	
		            <Grid.Column style={{textAlign: "center"}}>
		              <h3>Verify Signer</h3>
		              <Form onSubmit={verifySigner}>
		                <Form.Field>
		                  <input placeholder="Insert Address" />
		                </Form.Field>
		                <Button type='submit' primary>Verify Signer</Button>
		              </Form>
		              <p>{isASigner ? 'Yes!' : ''}</p>
		            </Grid.Column>

		            <Grid.Column style={{textAlign: "center"}}>
		              <h3>Update Signatures Needed</h3>
		              <Form onSubmit={updateSigsNeeded}>
		                <Form.Field>
		                  <input placeholder="Signatures Needed" />
		                </Form.Field>
		                <Button type='submit' primary>Update</Button>
		              </Form>
		            </Grid.Column>
		        </Grid.Row>
		        <Grid.Row style={{padding: "30px 0"}}>
		            <Grid.Column style={{textAlign: "center"}}>
		              <h3>Add A Signer</h3>
		              <Form onSubmit={addSigner}>
		                <Form.Field>
		                  <input placeholder="Insert Address" />
		                </Form.Field>
		                <Button type='submit' primary>Add Signer</Button>
		              </Form>
		            </Grid.Column>

		            <Grid.Column style={{textAlign: "center"}}>
		              <h3>Remove Signer</h3>
		              <Form onSubmit={removeSigner}>
		                <Form.Field>
		                  <input placeholder="Insert Address" />
		                </Form.Field>
		                <Button type='submit' primary>Remove Signer</Button>
		              </Form>
		            </Grid.Column>
		        </Grid.Row>
	          </Grid>
	        </Segment>
	    </>
	)
};


export default SignerInfo;	