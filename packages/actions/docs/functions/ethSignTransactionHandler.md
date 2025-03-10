[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethSignTransactionHandler

# Function: ethSignTransactionHandler()

> **ethSignTransactionHandler**(`options`): [`EthSignTransactionHandler`](../type-aliases/EthSignTransactionHandler.md)

Defined in: [packages/actions/src/eth/ethSignTransactionHandler.js:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSignTransactionHandler.js#L56)

Creates a handler for the `eth_signTransaction` JSON-RPC method that signs transactions using the specified accounts

This handler enables signing Ethereum transactions without broadcasting them to the network. It creates an EIP-2930
transaction signature using the private key of the specified account. The handler automatically retrieves the
current chain ID from the node.

## Parameters

### options

Configuration options for the handler

#### accounts

readonly `object`[]

Array of HD accounts that can be used for signing

#### getChainId

() => `Promise`\<`number`\>

Function to retrieve the current chain ID

## Returns

[`EthSignTransactionHandler`](../type-aliases/EthSignTransactionHandler.md)

A handler function for eth_signTransaction requests

## Throws

If the requested account (from address) is not found in the provided accounts list

## Example

```javascript
import { ethSignTransactionHandler } from '@tevm/actions'
import { mnemonicToAccount, parseGwei } from '@tevm/utils'

// Create accounts from a mnemonic
const mnemonic = 'test test test test test test test test test test test junk'
const accounts = Array.from(Array(10).keys()).map(
  (i) => mnemonicToAccount(mnemonic, { addressIndex: i })
)

// Create the handler
const handler = ethSignTransactionHandler({
  accounts,
  getChainId: async () => 1 // Mainnet
})

// Sign a transaction
try {
  const signedTx = await handler({
    from: accounts[0].address,
    to: '0x1234567890123456789012345678901234567890',
    value: 1000000000000000000n, // 1 ETH
    gas: 21000n,
    gasPrice: parseGwei('20'),
    nonce: 0n,
    data: '0x'
  })

  console.log('Signed transaction:', signedTx)
  // Can be used with eth_sendRawTransaction
} catch (error) {
  if (error.name === 'MissingAccountError') {
    console.error('Account not found:', error.message)
  } else {
    console.error('Unexpected error:', error)
  }
}
```
