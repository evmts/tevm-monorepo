[@tevm/vm](README.md) / Exports

# @tevm/vm

## Table of contents

### Classes

- [TevmVm](classes/TevmVm.md)

### Type Aliases

- [CreateVmOptions](modules.md#createvmoptions)

### Functions

- [createVm](modules.md#createvm)

## Type Aliases

### CreateVmOptions

Ƭ **CreateVmOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockchain` | `TevmBlockchain` |
| `common` | `TevmCommon` |
| `evm` | `Evm` |
| `stateManager` | `TevmStateManager` |

#### Defined in

[packages/vm/src/CreateVmOptions.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/CreateVmOptions.ts#L6)

## Functions

### createVm

▸ **createVm**(`«destructured»`): `Promise`\<[`TevmVm`](classes/TevmVm.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`CreateVmOptions`](modules.md#createvmoptions) |

#### Returns

`Promise`\<[`TevmVm`](classes/TevmVm.md)\>

#### Defined in

[packages/vm/src/createVm.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/createVm.ts#L9)
