[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / definePredeploy

# Variable: definePredeploy

> `const` **definePredeploy**: [`DefinePredeployFn`](../../predeploys/type-aliases/DefinePredeployFn.md)

Defined in: packages/predeploys/types/definePredeploy.d.ts:25

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
