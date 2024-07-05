[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / ContractParams

# Type Alias: ContractParams\<TAbi, TFunctionName, TThrowOnFail\>

> **ContractParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: [`EncodeFunctionDataParameters`](EncodeFunctionDataParameters.md)\<`TAbi`, `TFunctionName`\> & `BaseCallParams`\<`TThrowOnFail`\> & `object`

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
 - BaseCallParams
 - [EncodeFunctionDataParameters](EncodeFunctionDataParameters.md)

## Type declaration

### code?

> `readonly` `optional` **code**: [`Hex`](Hex.md)

Alias for deployedBytecode.

### deployedBytecode?

> `readonly` `optional` **deployedBytecode**: [`Hex`](Hex.md)

The deployed bytecode to execute at the contract address.
If not provided, the code will be fetched from state.

### to?

> `readonly` `optional` **to**: `Address`

The address of the contract to call.

## Type Parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

The ABI type.

• **TFunctionName** *extends* [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\> = [`ContractFunctionName`](ContractFunctionName.md)\<`TAbi`\>

The function name type from the ABI.

• **TThrowOnFail** *extends* `boolean` = `boolean`

The type indicating whether to throw on failure.

## Defined in

packages/actions/types/Contract/ContractParams.d.ts:41
