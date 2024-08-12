[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [contract](../README.md) / CreateContractFn

# Type Alias: CreateContractFn()

> **CreateContractFn**: \<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`, `THumanReadableAbi`\>(`{ name, humanReadableAbi, bytecode, deployedBytecode, code, }`) => [`Contract`](../../index/type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

Type of `createContract` factory function
Creates a tevm Contract instance from human readable abi

## Type Parameters

• **TName** *extends* `string`

• **TAbi** *extends* readonly `string`[] \| [`Abi`](../../index/type-aliases/Abi.md)

• **TAddress** *extends* `undefined` \| [`Address`](../../index/type-aliases/Address.md) = `undefined`

• **TBytecode** *extends* `undefined` \| [`Hex`](../../index/type-aliases/Hex.md) = `undefined`

• **TDeployedBytecode** *extends* `undefined` \| [`Hex`](../../index/type-aliases/Hex.md) = `undefined`

• **TCode** *extends* `undefined` \| [`Hex`](../../index/type-aliases/Hex.md) = `undefined`

• **THumanReadableAbi** *extends* readonly `string`[] = `TAbi` *extends* readonly `string`[] ? `TAbi` : `TAbi` *extends* [`Abi`](../../index/type-aliases/Abi.md) ? [`FormatAbi`](../../index/type-aliases/FormatAbi.md)\<`TAbi`\> : `never`

## Parameters

• **\{ name, humanReadableAbi, bytecode, deployedBytecode, code, \}**: [`CreateContractParams`](../../index/type-aliases/CreateContractParams.md)\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Returns

[`Contract`](../../index/type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Examples

```typescript
import { type Contract, createContract} from 'tevm/contract'

const contract: Contract = createContract({
  name: 'MyContract',
 	abi: [
 		...
 	],
})
```

To use a json abi first pass it into `formatAbi` to turn it into human readable

```typescript
import { type Contract, createContract} from 'tevm/contract'

const contract = createContract({
  name: 'MyContract',
 	abi: [
 		...
 	],
})
```

## Defined in

packages/contract/types/CreateContractFn.d.ts:32
