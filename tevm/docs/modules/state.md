[tevm](../README.md) / [Modules](../modules.md) / state

# Module: state

## Table of contents

### References

- [ForkStateManagerOpts](state.md#forkstatemanageropts)
- [ProxyStateManagerOpts](state.md#proxystatemanageropts)
- [TevmState](state.md#tevmstate)

### Classes

- [Cache](../classes/state.Cache.md)
- [ForkStateManager](../classes/state.ForkStateManager.md)
- [NormalStateManager](../classes/state.NormalStateManager.md)
- [ProxyStateManager](../classes/state.ProxyStateManager.md)

### Interfaces

- [AccountStorage](../interfaces/state.AccountStorage.md)
- [ParameterizedAccountStorage](../interfaces/state.ParameterizedAccountStorage.md)
- [TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md)

### Type Aliases

- [GetContractStorage](state.md#getcontractstorage)
- [ParameterizedTevmState](state.md#parameterizedtevmstate)
- [SerializableTevmState](state.md#serializabletevmstate)
- [TevmStateManager](state.md#tevmstatemanager)
- [TevmStateManagerOptions](state.md#tevmstatemanageroptions)

### Functions

- [createTevmStateManager](state.md#createtevmstatemanager)

## References

### ForkStateManagerOpts

Re-exports [ForkStateManagerOpts](../interfaces/index.ForkStateManagerOpts.md)

___

### ProxyStateManagerOpts

Re-exports [ProxyStateManagerOpts](../interfaces/index.ProxyStateManagerOpts.md)

___

### TevmState

Re-exports [TevmState](index.md#tevmstate)

## Type Aliases

### GetContractStorage

Ƭ **GetContractStorage**: (`address`: [`EthjsAddress`](../classes/utils.EthjsAddress.md), `key`: `Uint8Array`) => `Promise`\<`Uint8Array`\>

#### Type declaration

▸ (`address`, `key`): `Promise`\<`Uint8Array`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](../classes/utils.EthjsAddress.md) |
| `key` | `Uint8Array` |

##### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

evmts-monorepo/packages/state/types/Cache.d.ts:2

___

### ParameterizedTevmState

Ƭ **ParameterizedTevmState**: `Object`

#### Index signature

▪ [key: `string`]: [`ParameterizedAccountStorage`](../interfaces/state.ParameterizedAccountStorage.md)

#### Defined in

evmts-monorepo/packages/state/types/ParameterizedTevmState.d.ts:2

___

### SerializableTevmState

Ƭ **SerializableTevmState**: `Object`

#### Index signature

▪ [key: `string`]: \{ `balance`: [`Hex`](index.md#hex) ; `codeHash`: [`Hex`](index.md#hex) ; `nonce`: [`Hex`](index.md#hex) ; `storage?`: `StorageDump` ; `storageRoot`: [`Hex`](index.md#hex)  }

#### Defined in

evmts-monorepo/packages/state/types/SerializableTevmState.d.ts:3

___

### TevmStateManager

Ƭ **TevmStateManager**: [`NormalStateManager`](../classes/state.NormalStateManager.md) \| [`ForkStateManager`](../classes/state.ForkStateManager.md) \| [`ProxyStateManager`](../classes/state.ProxyStateManager.md)

#### Defined in

evmts-monorepo/packages/state/types/TevmStateManager.d.ts:4

___

### TevmStateManagerOptions

Ƭ **TevmStateManagerOptions**: \{ `fork`: [`ForkStateManagerOpts`](../interfaces/index.ForkStateManagerOpts.md)  } \| \{ `proxy`: [`ProxyStateManagerOpts`](../interfaces/index.ProxyStateManagerOpts.md)  } \| \{ `normal`: `NormalStateManagerOpts`  } \| {}

#### Defined in

evmts-monorepo/packages/state/types/TevmStateManager.d.ts:5

## Functions

### createTevmStateManager

▸ **createTevmStateManager**(`options`): [`ForkStateManager`](../classes/state.ForkStateManager.md) \| [`ProxyStateManager`](../classes/state.ProxyStateManager.md) \| [`NormalStateManager`](../classes/state.NormalStateManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`TevmStateManagerOptions`](state.md#tevmstatemanageroptions) |

#### Returns

[`ForkStateManager`](../classes/state.ForkStateManager.md) \| [`ProxyStateManager`](../classes/state.ProxyStateManager.md) \| [`NormalStateManager`](../classes/state.NormalStateManager.md)

#### Defined in

evmts-monorepo/packages/state/types/TevmStateManager.d.ts:12
