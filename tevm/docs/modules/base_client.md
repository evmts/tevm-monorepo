[tevm](../README.md) / [Modules](../modules.md) / base-client

# Module: base-client

## Table of contents

### References

- [AutoMining](base_client.md#automining)
- [BaseClient](base_client.md#baseclient)
- [BaseClientOptions](base_client.md#baseclientoptions)
- [CustomPrecompile](base_client.md#customprecompile)
- [Extension](base_client.md#extension)
- [Hardfork](base_client.md#hardfork)
- [createBaseClient](base_client.md#createbaseclient)

### Type Aliases

- [IntervalMining](base_client.md#intervalmining)
- [ManualMining](base_client.md#manualmining)
- [MiningConfig](base_client.md#miningconfig)

## References

### AutoMining

Re-exports [AutoMining](index.md#automining)

___

### BaseClient

Re-exports [BaseClient](index.md#baseclient)

___

### BaseClientOptions

Re-exports [BaseClientOptions](index.md#baseclientoptions)

___

### CustomPrecompile

Re-exports [CustomPrecompile](index.md#customprecompile)

___

### Extension

Re-exports [Extension](index.md#extension)

___

### Hardfork

Re-exports [Hardfork](index.md#hardfork)

___

### createBaseClient

Re-exports [createBaseClient](index.md#createbaseclient)

## Type Aliases

### IntervalMining

Ƭ **IntervalMining**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `interval` | `number` |
| `type` | ``"interval"`` |

#### Defined in

evmts-monorepo/packages/base-client/types/MiningConfig.d.ts:1

___

### ManualMining

Ƭ **ManualMining**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `type` | ``"manual"`` |

#### Defined in

evmts-monorepo/packages/base-client/types/MiningConfig.d.ts:5

___

### MiningConfig

Ƭ **MiningConfig**: [`IntervalMining`](base_client.md#intervalmining) \| [`ManualMining`](base_client.md#manualmining) \| [`AutoMining`](index.md#automining) \| `GasMining`

#### Defined in

evmts-monorepo/packages/base-client/types/MiningConfig.d.ts:15
