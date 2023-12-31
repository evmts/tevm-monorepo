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

Ƭ **CustomPredeploy**\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends `ReadonlyArray`\<`string`\> |
| `TBytecode` | extends \`0x$\{string}\` \| `undefined` |
| `TDeployedBytecode` | extends \`0x$\{string}\` \| `undefined` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `Address` |
| `contract` | `TevmContract`\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\> |

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
| `TBytecode` | extends \`0x$\{string}\` |
| `TDeployedBytecode` | extends \`0x$\{string}\` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Pick`\<[`Predeploy`](classes/Predeploy.md)\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>, ``"address"`` \| ``"contract"``\> |

#### Returns

[`Predeploy`](classes/Predeploy.md)\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>

#### Defined in

[definePredeploy.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/vm/predeploys/src/definePredeploy.ts#L35)
