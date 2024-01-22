---
editUrl: false
next: false
prev: false
title: "definePredeploy"
---

> **definePredeploy**\<`TName`, `THumanReadableAbi`\>(`__namedParameters`): [`Predeploy`](/reference/tevm/predeploys/classes/predeploy/)\<`TName`, `THumanReadableAbi`\>

Defines a predeploy contract to use in the tevm vm

## Type parameters

▪ **TName** extends `string`

▪ **THumanReadableAbi** extends readonly `string`[]

## Parameters

▪ **\_\_namedParameters**: `Pick`\<[`Predeploy`](/reference/tevm/predeploys/classes/predeploy/)\<`TName`, `THumanReadableAbi`\>, `"contract"` \| `"address"`\>

## Returns

## Example

```ts
import { definePredeploy } from 'tevm/predeploys'
import { createMemoryClient } from 'tevm/vm'
import { createScript } from 'tevm/contract'

const predeploy = definePredeploy({
  address: `0x${'23'.repeat(20)}`,
  contract: createScript({
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

## Source

[definePredeploy.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/definePredeploy.ts#L27)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
