[@tevm/predeploys](README.md) / Exports

# @tevm/predeploys

## Table of contents

### Classes

- [Predeploy](classes/Predeploy.md)

### Type Aliases

- [CustomPredeploy](modules.md#custompredeploy)

### Functions

- [definePredeploy](modules.md#definepredeploy)

## Type Aliases

### CustomPredeploy

Ƭ **CustomPredeploy**\<`TName`, `THumanReadableAbi`\>: `Object`

Params taken by the definePredeploy function

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends `ReadonlyArray`\<`string`\> |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `contract` | `Script`\<`TName`, `THumanReadableAbi`\> |

#### Defined in

[CustomPredeploy.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/CustomPredeploy.ts#L7)

## Functions

### definePredeploy

▸ **definePredeploy**\<`TName`, `THumanReadableAbi`\>(`«destructured»`): [`Predeploy`](classes/Predeploy.md)\<`TName`, `THumanReadableAbi`\>

Defines a predeploy contract to use in the tevm vm

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Pick`\<[`Predeploy`](classes/Predeploy.md)\<`TName`, `THumanReadableAbi`\>, ``"contract"`` \| ``"address"``\> |

#### Returns

[`Predeploy`](classes/Predeploy.md)\<`TName`, `THumanReadableAbi`\>

**`Example`**

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

#### Defined in

[definePredeploy.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/definePredeploy.ts#L27)
