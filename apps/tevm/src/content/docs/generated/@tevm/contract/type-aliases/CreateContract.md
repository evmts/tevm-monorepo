---
editUrl: false
next: false
prev: false
title: "CreateContract"
---

> **CreateContract**: \<`TName`, `THumanReadableAbi`\>(`{
	name,
	humanReadableAbi,
}`) => [`Contract`](/generated/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`\>

Type of `createContract` factory function
Creates a tevm Contract instance from human readable abi

## Type parameters

▪ **TName** extends `string`

▪ **THumanReadableAbi** extends readonly `string`[]

## Parameters

▪ **\{
	name,
	humanReadableAbi,
}**: [`CreateContractParams`](/generated/tevm/contract/type-aliases/createcontractparams/)\<`TName`, `THumanReadableAbi`\>

## Returns

## Example

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

## Example

```typescript
import { type Contract, createContract} from 'tevm/contract'

const contract = createContract({
  name: 'MyContract',
 	abi: [
 		...
 	],
})
```

## Source

[packages/contract/src/types.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/types.ts#L41)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
