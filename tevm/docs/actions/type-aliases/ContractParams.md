[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / ContractParams

# Type Alias: ContractParams\<TAbi, TFunctionName, TThrowOnFail\>

> **ContractParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\> = [`EncodeFunctionDataParameters`](../../index/type-aliases/EncodeFunctionDataParameters.md)\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](BaseCallParams.md)\<`TThrowOnFail`\> & \{ `code`: [`Hex`](../../index/type-aliases/Hex.md); `deployedBytecode`: [`Hex`](../../index/type-aliases/Hex.md); `to`: [`Address`](Address.md); \} \| \{ `code`: [`Hex`](../../index/type-aliases/Hex.md); `deployedBytecode`: [`Hex`](../../index/type-aliases/Hex.md); `to`: [`Address`](Address.md); \} \| \{ `code`: [`Hex`](../../index/type-aliases/Hex.md); `deployedBytecode`: [`Hex`](../../index/type-aliases/Hex.md); `to`: [`Address`](Address.md); \}

Defined in: packages/actions/types/Contract/ContractParams.d.ts:41

Parameters to execute a call on a contract with TEVM.

This type combines the parameters required for encoding function data with additional call parameters.

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md) \| readonly `unknown`[] = [`Abi`](Abi.md)

The ABI type.

### TFunctionName

`TFunctionName` *extends* [`ContractFunctionName`](../../index/type-aliases/ContractFunctionName.md)\<`TAbi`\> = [`ContractFunctionName`](../../index/type-aliases/ContractFunctionName.md)\<`TAbi`\>

The function name type from the ABI.

### TThrowOnFail

`TThrowOnFail` *extends* `boolean` = `boolean`

The type indicating whether to throw on failure.

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
 - [BaseCallParams](BaseCallParams.md)
 - [EncodeFunctionDataParameters](../../index/type-aliases/EncodeFunctionDataParameters.md)
