import { ethers } from "ethers"
import { createContext, useContext, useEffect, useState } from "react"

import MultisigArtifact from '../artifacts/contracts/Multisig.sol/Multisig.json';
import { useEthereum } from "./EthereumProvider"

const ContractContext = createContext()

const ContractProvider = (props) => {
  const { provider } = useEthereum()
  const [contracts, setContracts] = useState([])

  function addContract(name, contract) {
    let newContracts = [...contracts]
    newContracts[name] = contract
    setContracts(newContracts)
  }

  useEffect(() => {
    const multisig = new ethers.Contract(
      '0xEFd9bff2E93cFe15269eF0A4aE2F6330998cc672',
      MultisigArtifact.abi,
      provider
    )
    addContract("multisig", multisig)
  }, [])

  const variables = { contracts }
  const functions = { addContract }

  const value = { ...variables, ...functions }

  return <ContractContext.Provider value={value} {...props} />
}

export const useContract = () => {
  return useContext(ContractContext)
}

export default ContractProvider