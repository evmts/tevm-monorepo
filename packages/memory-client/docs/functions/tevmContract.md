[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmContract

# Function: tevmContract()

> **tevmContract**\<`TAbi`, `TFunctionName`\>(`client`, `params`): `Promise`\<`ContractResult`\<`TAbi`, `TFunctionName`\>\>

Defined in: [packages/memory-client/src/tevmContract.js:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmContract.js#L28)

Tree-shakeable `tevmContract` action. Higher-level wrapper around `tevmCall` that handles ABI
encoding/decoding and decodes revert messages, with full TypeScript inference from the ABI.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TAbi` *extends* readonly `unknown`[] \| `Abi` | `Abi` |
| `TFunctionName` *extends* `string` | `ContractFunctionName`\<`TAbi`\> |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `client` | `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>\> |
| `params` | `ContractParams`\<`TAbi`, `TFunctionName`\> & `CallEvents` |

## Returns

`Promise`\<`ContractResult`\<`TAbi`, `TFunctionName`\>\>

## Example

```typescript
import { tevmContract } from 'tevm/actions'
import { createClient, parseAbi } from 'viem'
import { createTevmTransport } from 'tevm'

const client = createClient({ transport: createTevmTransport() })
const balance = await tevmContract(client, {
  abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
  address: '0x4200000000000000000000000000000000000042',
  functionName: 'balanceOf',
  args: ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'],
})
```

## See

 - [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/) for options.
 - [ContractResult](https://tevm.sh/reference/tevm/actions/type-aliases/contractresult/) for return values.

## Throws

Will throw if the contract call reverts (error contains decoded revert reason when available).
