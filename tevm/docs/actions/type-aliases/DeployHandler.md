[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DeployHandler

# Type Alias: DeployHandler()

> **DeployHandler** = \<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>(`action`) => `Promise`\<[`DeployResult`](DeployResult.md)\>

Defined in: packages/actions/types/Deploy/DeployHandlerType.d.ts:44

Handler for deploying contracts on TEVM.
This handler is used to deploy a contract by specifying the deployment parameters, ABI, and constructor arguments.

## Type Parameters

### TThrowOnFail

`TThrowOnFail` *extends* `boolean` = `boolean`

Indicates whether to throw an error on failure.

### TAbi

`TAbi` *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] = [`Abi`](../../index/type-aliases/Abi.md)

The ABI type of the contract.

### THasConstructor

`THasConstructor` = `TAbi` *extends* [`Abi`](../../index/type-aliases/Abi.md) ? [`Abi`](../../index/type-aliases/Abi.md) *extends* `TAbi` ? `true` : \[`Extract`\<`TAbi`\[`number`\], \{ `type`: `"constructor"`; \}\>\] *extends* \[`never`\] ? `false` : `true` : `true`

Indicates whether the contract has a constructor.

### TAllArgs

`TAllArgs` = [`ContractConstructorArgs`](../../utils/type-aliases/ContractConstructorArgs.md)\<`TAbi`\>

The types of the constructor arguments.

## Parameters

### action

[`DeployParams`](DeployParams.md)\<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\> & [`CallEvents`](CallEvents.md)

The deployment parameters and optional event handlers.

## Returns

`Promise`\<[`DeployResult`](DeployResult.md)\>

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
  // Optional event handlers
  onStep: (step, next) => {
    console.log(`Executing ${step.opcode.name} at PC=${step.pc}`)
    next?.()
  }
})
console.log(result)
```
