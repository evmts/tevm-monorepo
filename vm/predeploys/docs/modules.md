[@tevm/predeploys](README.md) / Modules

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

[definePredeploy.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/predeploys/src/definePredeploy.ts#L6)

## Functions

### definePredeploy

▸ **definePredeploy**\<`TName`, `THumanReadableAbi`\>(`«destructured»`): [`Predeploy`](classes/Predeploy.md)\<`TName`, `THumanReadableAbi`\>

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

#### Defined in

[definePredeploy.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/vm/predeploys/src/definePredeploy.ts#L26)
