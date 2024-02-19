[@tevm/state](README.md) / Exports

# @tevm/state

## Table of contents

### Classes

- [Cache](classes/Cache.md)
- [ForkStateManager](classes/ForkStateManager.md)
- [NormalStateManager](classes/NormalStateManager.md)
- [ProxyStateManager](classes/ProxyStateManager.md)

### Interfaces

- [AccountStorage](interfaces/AccountStorage.md)
- [ForkStateManagerOpts](interfaces/ForkStateManagerOpts.md)
- [ParameterizedAccountStorage](interfaces/ParameterizedAccountStorage.md)
- [ProxyStateManagerOpts](interfaces/ProxyStateManagerOpts.md)
- [TevmStateManagerInterface](interfaces/TevmStateManagerInterface.md)

### Type Aliases

- [GetContractStorage](modules.md#getcontractstorage)
- [ParameterizedTevmState](modules.md#parameterizedtevmstate)
- [SerializableTevmState](modules.md#serializabletevmstate)
- [TevmStateManager](modules.md#tevmstatemanager)
- [TevmStateManagerOptions](modules.md#tevmstatemanageroptions)

### Functions

- [createTevmStateManager](modules.md#createtevmstatemanager)

## Type Aliases

### GetContractStorage

Ƭ **GetContractStorage**: (`address`: `EthjsAddress`, `key`: `Uint8Array`) => `Promise`\<`Uint8Array`\>

#### Type declaration

▸ (`address`, `key`): `Promise`\<`Uint8Array`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `EthjsAddress` |
| `key` | `Uint8Array` |

##### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

[packages/state/src/Cache.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/Cache.ts#L5)

___

### ParameterizedTevmState

Ƭ **ParameterizedTevmState**: `Object`

#### Index signature

▪ [key: `string`]: [`ParameterizedAccountStorage`](interfaces/ParameterizedAccountStorage.md)

#### Defined in

[packages/state/src/ParameterizedTevmState.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/ParameterizedTevmState.ts#L4)

___

### SerializableTevmState

Ƭ **SerializableTevmState**: `Object`

#### Index signature

▪ [key: `string`]: [`AccountStorage`](interfaces/AccountStorage.md)

#### Defined in

[packages/state/src/SerializableTevmState.ts:3](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/SerializableTevmState.ts#L3)

___

### TevmStateManager

Ƭ **TevmStateManager**: [`NormalStateManager`](classes/NormalStateManager.md) \| [`ForkStateManager`](classes/ForkStateManager.md) \| [`ProxyStateManager`](classes/ProxyStateManager.md)

#### Defined in

[packages/state/src/TevmStateManager.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/TevmStateManager.ts#L11)

___

### TevmStateManagerOptions

Ƭ **TevmStateManagerOptions**: \{ `fork`: [`ForkStateManagerOpts`](interfaces/ForkStateManagerOpts.md)  } \| \{ `proxy`: [`ProxyStateManagerOpts`](interfaces/ProxyStateManagerOpts.md)  } \| {}

#### Defined in

[packages/state/src/TevmStateManager.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/TevmStateManager.ts#L16)

## Functions

### createTevmStateManager

▸ **createTevmStateManager**(`options`): [`ForkStateManager`](classes/ForkStateManager.md) \| [`NormalStateManager`](classes/NormalStateManager.md) \| [`ProxyStateManager`](classes/ProxyStateManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`TevmStateManagerOptions`](modules.md#tevmstatemanageroptions) |

#### Returns

[`ForkStateManager`](classes/ForkStateManager.md) \| [`NormalStateManager`](classes/NormalStateManager.md) \| [`ProxyStateManager`](classes/ProxyStateManager.md)

#### Defined in

[packages/state/src/TevmStateManager.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/TevmStateManager.ts#L21)
