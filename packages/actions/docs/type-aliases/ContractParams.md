[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / ContractParams

# Type Alias: ContractParams\<TAbi, TFunctionName, TThrowOnFail\>

> **ContractParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: `EncodeFunctionDataParameters`\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](BaseCallParams.md)\<`TThrowOnFail`\> & `object`

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
 - [BaseCallParams](BaseCallParams.md)
 - EncodeFunctionDataParameters

## Type declaration

### code?

> `readonly` `optional` **code**: `Hex`

Alias for deployedBytecode.

### deployedBytecode?

> `readonly` `optional` **deployedBytecode**: `Hex`

The deployed bytecode to execute at the contract address.
If not provided, the code will be fetched from state.

### to?

> `readonly` `optional` **to**: [`Address`](Address.md)

The address of the contract to call.

## Type Parameters

• **TAbi** *extends* [`Abi`](Abi.md) \| readonly `unknown`[] = [`Abi`](Abi.md)

The ABI type.

• **TFunctionName** *extends* `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

The function name type from the ABI.

• **TThrowOnFail** *extends* `boolean` = `boolean`

The type indicating whether to throw on failure.

## Defined in

[packages/actions/src/Contract/ContractParams.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Contract/ContractParams.ts#L42)
