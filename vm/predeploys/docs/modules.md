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

Ƭ **CustomPredeploy**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `contract` | `TevmContract` |

#### Defined in

[definePredeploy.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/predeploys/src/definePredeploy.ts#L6)

## Functions

### definePredeploy

▸ **definePredeploy**\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>(`«destructured»`): [`Predeploy`](classes/Predeploy.md)\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |
| `TBytecode` | extends `undefined` \| \`0x$\{string}\` |
| `TDeployedBytecode` | extends `undefined` \| \`0x$\{string}\` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Pick`\<[`Predeploy`](classes/Predeploy.md)\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>, ``"contract"`` \| ``"address"``\> |

#### Returns

[`Predeploy`](classes/Predeploy.md)\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>

#### Defined in

[definePredeploy.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/vm/predeploys/src/definePredeploy.ts#L30)
