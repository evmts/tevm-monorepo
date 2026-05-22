[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / StorageProof

# Type Alias: StorageProof

> **StorageProof** = `object`

Defined in: [packages/actions/src/eth/EthResult.ts:313](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L313)

Storage proof for a single storage slot

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="key"></a> `key` | [`Hex`](Hex.md) | The key of the storage slot | [packages/actions/src/eth/EthResult.ts:317](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L317) |
| <a id="proof"></a> `proof` | [`Hex`](Hex.md)[] | The merkle proof for this storage slot | [packages/actions/src/eth/EthResult.ts:325](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L325) |
| <a id="value"></a> `value` | [`Hex`](Hex.md) | The value of the storage slot | [packages/actions/src/eth/EthResult.ts:321](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L321) |
