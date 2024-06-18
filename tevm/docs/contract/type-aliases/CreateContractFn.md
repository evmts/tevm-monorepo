[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [contract](../README.md) / CreateContractFn

# Type alias: CreateContractFn()

> **CreateContractFn**: \<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>(`{ name, humanReadableAbi, bytecode, deployedBytecode, code, }`) => [`Contract`](../../index/type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

Type of `createContract` factory function
Creates a tevm Contract instance from human readable abi

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

## Type parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

• **TAddress** *extends* `undefined` \| [`Address`](../../index/type-aliases/Address.md) = `undefined`

• **TBytecode** *extends* `undefined` \| [`Hex`](../../index/type-aliases/Hex.md) = `undefined`

• **TDeployedBytecode** *extends* `undefined` \| [`Hex`](../../index/type-aliases/Hex.md) = `undefined`

• **TCode** *extends* `undefined` \| [`Hex`](../../index/type-aliases/Hex.md) = `undefined`

## Parameters

• **\{ name, humanReadableAbi, bytecode, deployedBytecode, code, \}**: [`CreateContractParams`](../../index/type-aliases/CreateContractParams.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Returns

[`Contract`](../../index/type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Source

packages/contract/types/CreateContractFn.d.ts:32
