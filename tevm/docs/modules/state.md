[tevm](../README.md) / [Modules](../modules.md) / state

# Module: state

## Table of contents

### References

- [ForkStateManagerOpts](state.md#forkstatemanageropts)
- [ProxyStateManagerOpts](state.md#proxystatemanageropts)
- [SerializableTevmState](state.md#serializabletevmstate)

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

## References

### ForkStateManagerOpts

Re-exports [ForkStateManagerOpts](../interfaces/index.ForkStateManagerOpts.md)

___

### ProxyStateManagerOpts

Re-exports [ProxyStateManagerOpts](../interfaces/index.ProxyStateManagerOpts.md)

___

### SerializableTevmState

Re-exports [SerializableTevmState](index.md#serializabletevmstate)

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
