[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / ContractParams

# Type Alias: ContractParams\<TAbi, TFunctionName, TThrowOnFail\>

> **ContractParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: [`EncodeFunctionDataParameters`](EncodeFunctionDataParameters.md)\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](../../actions/type-aliases/BaseCallParams.md)\<`TThrowOnFail`\> & \{ `code`: [`Hex`](Hex.md); `deployedBytecode`: [`Hex`](Hex.md); `to`: [`Address`](../../actions/type-aliases/Address.md); \} \| \{ `code`: [`Hex`](Hex.md); `deployedBytecode`: [`Hex`](Hex.md); `to`: [`Address`](../../actions/type-aliases/Address.md); \} \| \{ `code`: [`Hex`](Hex.md); `deployedBytecode`: [`Hex`](Hex.md); `to`: [`Address`](../../actions/type-aliases/Address.md); \}

Defined in: packages/actions/dist/index.d.ts:1347

Parameters to execute a call on a contract with TEVM.

This type combines the parameters required for encoding function data with additional call parameters.

## Type Parameters

• **TAbi** *extends* [`Abi`](../../actions/type-aliases/Abi.md) \| readonly `unknown`[] = [`Abi`](../../actions/type-aliases/Abi.md)

The ABI type.

• **TFunctionName** *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\> = [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\>

The function name type from the ABI.

• **TThrowOnFail** *extends* `boolean` = `boolean`

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
 - [BaseCallParams](../../actions/type-aliases/BaseCallParams.md)
 - [EncodeFunctionDataParameters](EncodeFunctionDataParameters.md)
