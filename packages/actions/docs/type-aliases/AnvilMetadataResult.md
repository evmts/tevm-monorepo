[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilMetadataResult

# Type Alias: AnvilMetadataResult

> **AnvilMetadataResult** = `object`

Defined in: [packages/actions/src/anvil/AnvilResult.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L71)

## Properties

### chainId

> **chainId**: `number`

Defined in: [packages/actions/src/anvil/AnvilResult.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L75)

Chain ID

***

### clientVersion

> **clientVersion**: `string`

Defined in: [packages/actions/src/anvil/AnvilResult.ts:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L73)

Client version (e.g., "tevm/1.0.0")

***

### forked?

> `optional` **forked**: `object`

Defined in: [packages/actions/src/anvil/AnvilResult.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L77)

Whether the node is in fork mode

#### blockNumber

> **blockNumber**: `number`

The block number the fork was created from

#### url

> **url**: `string`

The URL being forked

***

### snapshots

> **snapshots**: `Record`\<`string`, `string`\>

Defined in: [packages/actions/src/anvil/AnvilResult.ts:84](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L84)

Snapshots taken (for evm_snapshot/evm_revert)
