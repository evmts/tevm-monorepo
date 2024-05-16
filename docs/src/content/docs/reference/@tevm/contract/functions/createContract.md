---
editUrl: false
next: false
prev: false
title: "createContract"
---

> **createContract**\<`TName`, `THumanReadableAbi`\>(`__namedParameters`): [`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`\>

Creates a tevm Contract instance from human readable abi

## Type parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

## Parameters

• **\_\_namedParameters**: [`CreateContractParams`](/reference/tevm/contract/type-aliases/createcontractparams/)\<`TName`, `THumanReadableAbi`\>

## Returns

[`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`\>

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

## Source

[createContract.js:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/createContract.js#L34)
