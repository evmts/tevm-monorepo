---
editUrl: false
next: false
prev: false
title: "DeployHandler"
---

> **DeployHandler**: \<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>(`action`) => `Promise`\<[`DeployResult`](/reference/tevm/actions/type-aliases/deployresult/)\>

Handler for deploying contracts on TEVM.
This handler is used to deploy a contract by specifying the deployment parameters, ABI, and constructor arguments.

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

Indicates whether to throw an error on failure.

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/utils/type-aliases/abi/)

The ABI type of the contract.

• **THasConstructor** = `TAbi` *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) ? [`Abi`](/reference/tevm/utils/type-aliases/abi/) *extends* `TAbi` ? `true` : [`Extract`\<`TAbi`\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`

Indicates whether the contract has a constructor.

• **TAllArgs** = [`ContractConstructorArgs`](/reference/tevm/utils/type-aliases/contractconstructorargs/)\<`TAbi`\>

The types of the constructor arguments.

## Parameters

• **action**: [`DeployParams`](/reference/tevm/actions/type-aliases/deployparams/)\<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>

The deployment parameters.

## Returns

`Promise`\<[`DeployResult`](/reference/tevm/actions/type-aliases/deployresult/)\>

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

## Defined in

[packages/actions/src/Deploy/DeployHandlerType.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Deploy/DeployHandlerType.ts#L39)
