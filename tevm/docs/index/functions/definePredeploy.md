**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > definePredeploy

# Function: definePredeploy()

> **definePredeploy**\<`TName`, `THumanReadableAbi`\>(`__namedParameters`): [`Predeploy`](../classes/Predeploy.md)\<`TName`, `THumanReadableAbi`\>

Defines a predeploy contract to use in the tevm vm

## Type parameters

▪ **TName** extends `string`

▪ **THumanReadableAbi** extends readonly `string`[]

## Parameters

▪ **\_\_namedParameters**: `Pick`\<[`Predeploy`](../classes/Predeploy.md)\<`TName`, `THumanReadableAbi`\>, `"address"` \| `"contract"`\>

## Returns

## Example

```ts
import { definePredeploy } from 'tevm/predeploys'
import { createMemoryTevm } from 'tevm/vm'
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

const vm = createMemoryTevm({
 predeploys: [predeploy.predeploy()],
})
```

## Source

vm/predeploys/types/definePredeploy.d.ts:25

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
