---
editUrl: false
next: false
prev: false
title: "DefinePredeployFn"
---

> **DefinePredeployFn**: \<`TName`, `THumanReadableAbi`\>(`contract`) => [`Predeploy`](/reference/tevm/predeploys/type-aliases/predeploy/)\<`TName`, `THumanReadableAbi`\>

Defines a predeploy contract to use in the tevm vm

## Example

```ts
import { definePredeploy } from 'tevm/predeploys'
import { createMemoryClient } from 'tevm/vm'
import { createContract } from 'tevm/contract'

const predeploy = definePredeploy({
  address: `0x${'23'.repeat(20)}`,
  contract: createContract({
    name: 'PredeployExample',
    humanReadableAbi: ['function foo() external pure returns (uint256)'],
    bytecode: '0x608060405234801561001057600080fd5b5061012f806100206000396000f3fe608060405260043610610041576000357c0100',
    deployedBytecode: '0x608060405260043610610041576000357c010000
  })
})

const vm = createMemoryClient({
 predeploys: [predeploy.predeploy()],
})
```

## Type Parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

## Parameters

• **contract**: [`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`, [`Address`](/reference/tevm/utils/type-aliases/address/), [`Hex`](/reference/tevm/utils/type-aliases/hex/), [`Hex`](/reference/tevm/utils/type-aliases/hex/)\>

## Returns

[`Predeploy`](/reference/tevm/predeploys/type-aliases/predeploy/)\<`TName`, `THumanReadableAbi`\>

## Defined in

[DefinePredeployFn.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/DefinePredeployFn.ts#L28)
