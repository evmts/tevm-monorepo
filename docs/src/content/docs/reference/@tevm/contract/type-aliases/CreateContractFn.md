---
editUrl: false
next: false
prev: false
title: "CreateContractFn"
---

> **CreateContractFn**: \<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`, `THumanReadableAbi`\>(`{
	name,
	humanReadableAbi,
	bytecode,
	deployedBytecode,
	code,
}`) => [`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

Type of `createContract` factory function
Creates a tevm Contract instance from human readable abi

## Type Parameters

• **TName** *extends* `string`

• **TAbi** *extends* readonly `string`[] \| [`Abi`](/reference/tevm/utils/type-aliases/abi/)

• **TAddress** *extends* `undefined` \| [`Address`](/reference/tevm/utils/type-aliases/address/) = `undefined`

• **TBytecode** *extends* `undefined` \| [`Hex`](/reference/tevm/utils/type-aliases/hex/) = `undefined`

• **TDeployedBytecode** *extends* `undefined` \| [`Hex`](/reference/tevm/utils/type-aliases/hex/) = `undefined`

• **TCode** *extends* `undefined` \| [`Hex`](/reference/tevm/utils/type-aliases/hex/) = `undefined`

• **THumanReadableAbi** *extends* readonly `string`[] = `TAbi` *extends* readonly `string`[] ? `TAbi` : `TAbi` *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) ? [`FormatAbi`](/reference/tevm/utils/type-aliases/formatabi/)\<`TAbi`\> : `never`

## Parameters

• **\{
	name,
	humanReadableAbi,
	bytecode,
	deployedBytecode,
	code,
\}**: [`CreateContractParams`](/reference/tevm/contract/type-aliases/createcontractparams/)\<`TName`, `TAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

## Returns

[`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`, `TAddress`, `TBytecode`, `TDeployedBytecode`, `TCode`\>

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

[CreateContractFn.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/CreateContractFn.ts#L33)
