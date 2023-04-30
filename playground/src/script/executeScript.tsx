import { publicClient } from '../clients/publicClient'
import { HelloWorld } from './HelloWorld.s.sol'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const helloWorldScript = publicClient.script(HelloWorld)

export const ExecuteScript = () => {
  const [contractAddress, setContractAddress] = useState('0x4200000000')
  const [recipient, setRecipient] = useState('0x42000000')
  const [amount, setAmount] = useState(10)
  const { data, error, isLoading } = useQuery(
    [HelloWorld.id, contractAddress, recipient, amount],
    async () => {
      return helloWorldScript.run()
    },
  )
  return (
    <div>
      <div>Testing a script</div>
      <div>This script will transfer an erc20 to a receipient</div>
      <div>
        <div>Contract address</div>
        <input
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />{' '}
        <div>Recipient Address</div>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />{' '}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />{' '}
        Result:
        <div id="data">{data?.data}</div>
        TxHash:
        {error && <div>{JSON.stringify(error)}</div>}
        {isLoading && <div>Loading...</div>}
      </div>
    </div>
  )
}
