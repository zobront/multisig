import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'

import EthereumProvider from "../providers/EthereumProvider"
import ContractProvider from "../providers/ContractProvider"

const App = ({ Component, pageProps }) => {
  return (
    <EthereumProvider>
      <ContractProvider>
        <Component {...pageProps} />
      </ContractProvider>
    </EthereumProvider>
  )
}

export default App
