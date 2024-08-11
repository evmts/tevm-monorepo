[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / tevmDeploy

# Function: tevmDeploy()

> **tevmDeploy**(`client`, `params`): `Promise`\<`DeployResult`\>

A tree-shakeable version of the `tevmDeploy` action for viem.
Deploys a contract using TEVM.

This function deploys a contract by taking its ABI, bytecode, and constructor arguments. The deployed contract's address is available in the `result.createdAddress`. Note that the contract is not actually in the state until the transaction is mined. In manual mode, you must call `client.mine()` before you can interact with the deployed contract.

As an alternative, the `setAccount` action can be used to directly put contract bytecode into the state without deploying it via a transaction.

## Parameters

• **client**: `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| `object`\>

The viem client configured with TEVM transport.

• **params**: `DeployParams`\<`boolean`, `Abi`, `true`, readonly `unknown`[]\>

Parameters for the contract deployment, including ABI, bytecode, and constructor arguments.

## Returns

`Promise`\<`DeployResult`\>

The result of the contract deployment, including the created contract address.

## Examples

```typescript
import { tevmDeploy } from 'tevm/actions'
import { createClient, http } from 'viem'
import { optimism } from 'tevm/common'
import { createTevmTransport } from 'tevm'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) }
  }),
  chain: optimism,
})

async function example() {
  const result = await tevmDeploy(client, {
    abi: [...],
    bytecode: '0x...',
    args: ['constructorArg1', 123, ...],
  })
  console.log(result.createdAddress)

  // In manual mode, you must mine the transaction
  await client.mine()

  // Alternatively, you can get the contract address from the transaction receipt
  const receipt = await client.getTransactionReceipt({ hash: result.transactionHash })
  console.log(receipt.contractAddress)
}

example()
```

```typescript
import { tevmDeploy } from 'tevm/actions'
import { createClient, http } from 'viem'
import { optimism } from 'tevm/common'
import { createTevmTransport } from 'tevm'
import { MyContract } from './MyContract.sol'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) }
  }),
  chain: optimism,
})

async function example() {
  const result = await tevmDeploy(client, MyContract.deploy('constructor arg'))
  console.log(result.createdAddress)

  // In manual mode, you must mine the transaction
  await client.mine()

  // Alternatively, you can get the contract address from the transaction receipt
  const receipt = await client.getTransactionReceipt({ hash: result.transactionHash })
  console.log(receipt.contractAddress)
}

example()
```

## See

 - [DeployParams](https://tevm.sh/reference/tevm/actions/type-aliases/deployparams/) for options reference.
 - [DeployResult](https://tevm.sh/reference/tevm/actions/type-aliases/deployresult/) for return values reference.
 - [BaseCallParams](https://tevm.sh/reference/tevm/actions/type-aliases/basecallparams-1/) for the base call parameters.
 - [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 - [SetAccount](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountparams/) for putting contract bytecode into the state without deploying.
 - [TEVM Bundler Guide](https://tevm.sh/learn/solidity-imports/) for using the TEVM bundler to deploy contracts.

Additionally, you can use the viem wallet action `deploy` as a viable alternative. While it doesn't offer the same advanced functionality such as account impersonation or tracing capabilities, it works great for simple use cases.

## Defined in

[packages/memory-client/src/tevmDeploy.js:87](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmDeploy.js#L87)
