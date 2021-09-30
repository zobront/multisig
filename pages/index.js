import Head from 'next/head'
import Layout from '../components/Layout'
import styles from '../styles/Home.module.css'

import Deposit from '../components/Deposit'
import Requests from '../components/Requests'
import SignerInfo from '../components/SignerInfo'

import { Button, Dimmer, Loader } from 'semantic-ui-react'

import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useEthereum } from "../providers/EthereumProvider"
import { useContract } from "../providers/ContractProvider"

const Home = () => {
  const [status, setStatus] = useState('ready');
  const [sigsNeeded, setSigsNeeded] = useState();

  const { provider, signer, address } = useEthereum();
  const { contracts } = useContract();
  const { multisig } = contracts;

  useEffect(async () => {
    if (multisig) {
      const sigsNeeded = await multisig.sigsNeeded();
      setSigsNeeded(sigsNeeded.toNumber())
    }
  })

  return (
    <Layout>
      <Dimmer active={status == 'loading' ? true : false}>
        <Loader content='Processing' />
      </Dimmer>
      <h1>Multisig Wallet</h1>
      <Deposit setStatus={setStatus} />
      <Requests setStatus={setStatus} sigsNeeded={sigsNeeded} />
      <SignerInfo setStatus={setStatus} sigsNeeded={sigsNeeded} setSigsNeeded={setSigsNeeded} />
    </Layout>
  );
}

export default Home;