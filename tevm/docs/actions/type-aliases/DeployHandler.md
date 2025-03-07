[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DeployHandler

# Type Alias: DeployHandler()

> **DeployHandler**: \<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>(`action`) => `Promise`\<[`DeployResult`](../../index/type-aliases/DeployResult.md)\>

Defined in: packages/actions/types/Deploy/DeployHandlerType.d.ts:38

Handler for deploying contracts on TEVM.
This handler is used to deploy a contract by specifying the deployment parameters, ABI, and constructor arguments.

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

Indicates whether to throw an error on failure.

• **TAbi** *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] = [`Abi`](../../index/type-aliases/Abi.md)

The ABI type of the contract.

• **THasConstructor** = `TAbi` *extends* [`Abi`](../../index/type-aliases/Abi.md) ? [`Abi`](../../index/type-aliases/Abi.md) *extends* `TAbi` ? `true` : \[`Extract`\<`TAbi`\[`number`\], \{ `type`: `"constructor"`; \}\>\] *extends* \[`never`\] ? `false` : `true` : `true`

Indicates whether the contract has a constructor.

• **TAllArgs** = [`ContractConstructorArgs`](../../utils/type-aliases/ContractConstructorArgs.md)\<`TAbi`\>

The types of the constructor arguments.

## Parameters

### action

[`DeployParams`](../../index/type-aliases/DeployParams.md)\<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>

The deployment parameters.

## Returns

`Promise`\<[`DeployResult`](../../index/type-aliases/DeployResult.md)\>

The result of the deployment.

## Example

```typescript
import { createClient } from 'viem'
import { deployHandler } from 'tevm/actions'

const client = createClient({
  transport: createTevmTransport({ fork: { transport: http('https://mainnet.optimism.io')({}) } })
})

const handler = deployHandler(client)

const result = await handler({
  abi: [...], // ABI array
  bytecode: '0x...', // Contract bytecode
  args: [arg1, arg2], // Constructor arguments
  from: '0x123...',
  gas: 1000000n,
  gasPrice: 1n,
})
console.log(result)
```
