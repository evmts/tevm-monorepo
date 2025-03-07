[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [predeploys](../README.md) / DefinePredeployFn

# Type Alias: DefinePredeployFn()

> **DefinePredeployFn**: \<`TName`, `THumanReadableAbi`\>(`contract`) => [`Predeploy`](../../index/type-aliases/Predeploy.md)\<`TName`, `THumanReadableAbi`\>

Defined in: packages/predeploys/types/DefinePredeployFn.d.ts:27

Defines a predeploy contract to use in the tevm vm

## Type Parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

## Parameters

### contract

[`Contract`](../../index/type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`, [`Address`](../../index/type-aliases/Address.md), [`Hex`](../../index/type-aliases/Hex.md), [`Hex`](../../index/type-aliases/Hex.md)\>

## Returns

[`Predeploy`](../../index/type-aliases/Predeploy.md)\<`TName`, `THumanReadableAbi`\>

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
