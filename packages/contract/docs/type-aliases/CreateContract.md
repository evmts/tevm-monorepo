**@tevm/contract** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > CreateContract

# Type alias: CreateContract

> **CreateContract**: \<`TName`, `THumanReadableAbi`\>(`{
	name,
	humanReadableAbi,
}`) => [`Contract`](Contract.md)\<`TName`, `THumanReadableAbi`\>

Type of `createContract` factory function
Creates a tevm Contract instance from human readable abi

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

## Type parameters

▪ **TName** extends `string`

▪ **THumanReadableAbi** extends readonly `string`[]

## Parameters

▪ **\{
	name,
	humanReadableAbi,
}**: [`CreateContractParams`](CreateContractParams.md)\<`TName`, `THumanReadableAbi`\>

## Source

[types.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/types.ts#L41)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
