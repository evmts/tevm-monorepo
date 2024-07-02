---
editUrl: false
next: false
prev: false
title: "ContractResult"
---

> **ContractResult**\<`TAbi`, `TFunctionName`, `ErrorType`\>: `Omit`\<[`CallResult`](/reference/tevm/actions/type-aliases/callresult/), `"errors"`\> & `object` \| [`CallResult`](/reference/tevm/actions/type-aliases/callresult/)\<`ErrorType`\> & `object`

The result type for a TEVM contract call.

This type extends the `CallResult` type with additional contract-specific fields, and it supports both success and error states.

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
const result: ContractResult<Abi, 'myFunction'> = await contractCall(params)

if (result.errors) {
  console.error('Contract call failed:', result.errors)
} else {
  console.log('Contract call succeeded:', result.data)
}
```

## See

[CallResult](../../../../../../../reference/tevm/actions/type-aliases/callresult)

## Type Parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/actions/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/actions/type-aliases/abi/)

The ABI type.

• **TFunctionName** *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\> = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\>

The function name type from the ABI.

• **ErrorType** = [`TevmContractError`](/reference/tevm/actions/type-aliases/tevmcontracterror/)

The error type.

## Defined in

[packages/actions/src/Contract/ContractResult.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Contract/ContractResult.ts#L46)
