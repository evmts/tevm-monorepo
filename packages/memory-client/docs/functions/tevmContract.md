[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmContract

# Function: tevmContract()

> **tevmContract**\<`TAbi`, `TFunctionName`\>(`client`, `params`): `Promise`\<`ContractResult`\<`TAbi`, `TFunctionName`\>\>

Defined in: [packages/memory-client/src/tevmContract.js:122](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmContract.js#L122)

A tree-shakeable version of the `tevmContract` action for viem.
Provides a high-level interface for contract interactions with automatic encoding/decoding and full type safety.

While `tevmCall` offers a low-level interface for raw EVM execution, `tevmContract` provides a more convenient
developer experience for standard contract interactions by:

- Automatically encoding function parameters based on the ABI
- Automatically decoding return values to the appropriate JavaScript types
- Properly handling and decoding revert messages from failed calls
- Maintaining full type safety with TypeScript when using properly typed ABIs
- Simplifying complex contract interactions with a cleaner interface

Internally, `tevmContract` wraps the lower-level `tevmCall` action, handling all the ABI encoding/decoding
logic while providing access to the same advanced features like execution tracing and EVM customization.

## Type Parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **TFunctionName** *extends* `string` = `ContractFunctionName`\<`TAbi`\>

## Parameters

### client

`Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>\>

### params

`ContractParams`\<`TAbi`, `TFunctionName`\> & `CallEvents`

## Returns

`Promise`\<`ContractResult`\<`TAbi`, `TFunctionName`\>\>

## Examples

```typescript
import { tevmContract } from 'tevm/actions'
import { createClient, http, parseAbi } from 'viem'
import { optimism } from 'tevm/common'
import { createTevmTransport } from 'tevm'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) }
  }),
  chain: optimism,
})

async function example() {
  // Define the contract ABI
  const abi = parseAbi([
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)'
  ])

  // Read from contract (view function)
  const balance = await tevmContract(client, {
    abi,
    address: '0x4200000000000000000000000000000000000042', // OP token
    functionName: 'balanceOf',
    args: ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'],
  })
  console.log(`Balance: ${balance}`) // Returns the decoded uint256 as a bigint

  // Write to contract (non-view function with impersonation)
  const result = await tevmContract(client, {
    abi,
    address: '0x4200000000000000000000000000000000000042', // OP token
    functionName: 'transfer',
    args: ['0x1234567890123456789012345678901234567890', 100n],
    from: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // Impersonate this address
    createTransaction: true, // Create actual transaction that needs mining
  })

  // Transaction needs to be mined to take effect
  await client.mine()

  console.log(`Transfer result: ${result}`) // true

  // Optional: With execution tracing
  const tracedResult = await tevmContract(client, {
    abi,
    address: '0x4200000000000000000000000000000000000042',
    functionName: 'balanceOf',
    args: ['0x1234567890123456789012345678901234567890'],
    onStep: (step, next) => {
      console.log(`Opcode: ${step.opcode.name}`)
      next()
    }
  })
}

example()
```

```typescript
// Using with TEVM contract imports from the bundler
import { tevmContract } from 'tevm/actions'
import { createClient } from 'viem'
import { createTevmTransport } from 'tevm'
import { MyToken } from './MyToken.sol' // Direct Solidity import

const client = createClient({
  transport: createTevmTransport(),
  chain: {
    id: 1,
    name: 'Local TEVM'
  }
})

async function example() {
  // Deploy the contract first
  const deployResult = await tevmDeploy(client, MyToken.deploy("My Token", "MTK"))
  await client.mine()

  // Now use tevmContract with the imported contract
  const result = await tevmContract(client, {
    ...MyToken.read.balanceOf(), // Spread the contract's read method
    args: ['0x1234567890123456789012345678901234567890'],
    address: deployResult.createdAddress,
  })

  console.log(`Balance: ${result}`)
}
```

## See

 - [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/) for options reference.
 - [ContractResult](https://tevm.sh/reference/tevm/actions/type-aliases/contractresult/) for return values reference.
 - [BaseCallParams](https://tevm.sh/reference/tevm/actions/type-aliases/basecallparams-1/) for the base call parameters.
 - [tevmCall](https://tevm.sh/reference/tevm/memory-client/functions/tevmcall/) for the lower-level call interface.
 - [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 - [TEVM Contracts Guide](https://tevm.sh/learn/contracts/)

## Throws

Will throw if the contract call reverts. The error will contain the decoded revert reason when available.
