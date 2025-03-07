[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ContractParams

# Type Alias: ContractParams\<TAbi, TFunctionName, TThrowOnFail\>

> **ContractParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](BaseCallParams.md)\<`TThrowOnFail`\> & \{ `code`: `Hex`; `deployedBytecode`: `Hex`; `to`: [`Address`](Address.md); \} \| \{ `code`: `Hex`; `deployedBytecode`: `Hex`; `to`: [`Address`](Address.md); \} \| \{ `code`: `Hex`; `deployedBytecode`: `Hex`; `to`: [`Address`](Address.md); \}

Defined in: [packages/actions/src/Contract/ContractParams.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Contract/ContractParams.ts#L42)

Parameters to execute a call on a contract with TEVM.

This type combines the parameters required for encoding function data with additional call parameters.

## Type Parameters

• **TAbi** *extends* [`Abi`](Abi.md) \| readonly `unknown`[] = [`Abi`](Abi.md)

The ABI type.

• **TFunctionName** *extends* `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

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
 - [BaseCallParams](BaseCallParams.md)
 - EncodeFunctionDataParameters
