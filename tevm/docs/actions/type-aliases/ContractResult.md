[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / ContractResult

# Type Alias: ContractResult\<TAbi, TFunctionName, ErrorType\>

> **ContractResult**\<`TAbi`, `TFunctionName`, `ErrorType`\> = `Omit`\<[`CallResult`](CallResult.md), `"errors"`\> & `object` \| [`CallResult`](CallResult.md)\<`ErrorType`\> & `object`

Defined in: packages/actions/types/Contract/ContractResult.d.ts:45

The result type for a TEVM contract call.

This type extends the `CallResult` type with additional contract-specific fields, and it supports both success and error states.

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md) \| readonly `unknown`[] = [`Abi`](Abi.md)

The ABI type.

### TFunctionName

`TFunctionName` *extends* [`ContractFunctionName`](../../index/type-aliases/ContractFunctionName.md)\<`TAbi`\> = [`ContractFunctionName`](../../index/type-aliases/ContractFunctionName.md)\<`TAbi`\>

The function name type from the ABI.

### ErrorType

`ErrorType` = [`TevmContractError`](TevmContractError.md)

The error type.

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

[CallResult](CallResult.md)
