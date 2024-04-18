**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [index](../README.md) / createContract

# Function: createContract()

> **createContract**\<`TName`, `THumanReadableAbi`\>(`__namedParameters`): [`Contract`](../type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`\>

Creates a tevm Contract instance from human readable abi

## Type parameters

• **TName** extends `string`

• **THumanReadableAbi** extends readonly `string`[]

## Parameters

• **\_\_namedParameters**: [`CreateContractParams`](../type-aliases/CreateContractParams.md)\<`TName`, `THumanReadableAbi`\>

## Returns

[`Contract`](../type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`\>

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

packages/contract/types/createContract.d.ts:29
