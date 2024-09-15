---
editUrl: false
next: false
prev: false
title: "ContractParams"
---

> **ContractParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: [`EncodeFunctionDataParameters`](/reference/tevm/utils/type-aliases/encodefunctiondataparameters/)\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](/reference/tevm/actions/type-aliases/basecallparams/)\<`TThrowOnFail`\> & `object` \| `object` \| `object`

Parameters to execute a call on a contract with TEVM.

This type combines the parameters required for encoding function data with additional call parameters.

## Example

```typescript
import { createClient } from 'viem'
import { contractHandler } from 'tevm/actions'
import { Abi } from 'viem/utils'

const client = createClient({ transport: http('https://mainnet.optimism.io')({}) })

const params: ContractParams<Abi, 'myFunction'> = {
  abi: [...], // ABI array
  functionName: 'myFunction',
  args: [arg1, arg2],
  to: '0x123...',
  from: '0x123...',
  gas: 1000000n,
  gasPrice: 1n,
  skipBalance: true,
}

const contractCall = contractHandler(client)
const res = await contractCall(params)
console.log(res)
```

## See

 - [tevmContract](https://tevm.sh/reference/tevm/memory-client/functions/tevmContract)
 - [BaseCallParams](../../../../../../../../reference/tevm/actions/type-aliases/basecallparams)
 - [EncodeFunctionDataParameters](../../../../../../../../reference/tevm/utils/type-aliases/encodefunctiondataparameters)

## Type Parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/actions/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/actions/type-aliases/abi/)

The ABI type.

• **TFunctionName** *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\> = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\>

The function name type from the ABI.

• **TThrowOnFail** *extends* `boolean` = `boolean`

The type indicating whether to throw on failure.

## Defined in

[packages/actions/src/Contract/ContractParams.ts:42](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/Contract/ContractParams.ts#L42)
