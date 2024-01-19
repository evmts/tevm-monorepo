**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > createContract

# Function: createContract()

> **createContract**\<`TName`, `THumanReadableAbi`\>(`__namedParameters`): [`Contract`](../type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`\>

Creates a tevm Contract instance from human readable abi

## Type parameters

▪ **TName** extends `string`

▪ **THumanReadableAbi** extends readonly `string`[]

## Parameters

▪ **\_\_namedParameters**: [`CreateContractParams`](../../contract/type-aliases/CreateContractParams.md)\<`TName`, `THumanReadableAbi`\>

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

packages/contract/dist/index.d.ts:449

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
