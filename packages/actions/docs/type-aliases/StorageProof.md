[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / StorageProof

# Type Alias: StorageProof

> **StorageProof** = `object`

Defined in: [packages/actions/src/eth/EthResult.ts:313](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L313)

Storage proof for a single storage slot

## Properties

### key

> **key**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/eth/EthResult.ts:317](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L317)

The key of the storage slot

***

### proof

> **proof**: [`Hex`](Hex.md)[]

Defined in: [packages/actions/src/eth/EthResult.ts:325](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L325)

The merkle proof for this storage slot

***

### value

> **value**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/eth/EthResult.ts:321](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L321)

The value of the storage slot
