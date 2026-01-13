[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / AnvilMetadataResult

# Type Alias: AnvilMetadataResult

> **AnvilMetadataResult** = `object`

Defined in: packages/actions/types/anvil/AnvilResult.d.ts:44

## Properties

### chainId

> **chainId**: `number`

Defined in: packages/actions/types/anvil/AnvilResult.d.ts:48

Chain ID

***

### clientVersion

> **clientVersion**: `string`

Defined in: packages/actions/types/anvil/AnvilResult.d.ts:46

Client version (e.g., "tevm/1.0.0")

***

### forked?

> `optional` **forked**: `object`

Defined in: packages/actions/types/anvil/AnvilResult.d.ts:50

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

Defined in: packages/actions/types/anvil/AnvilResult.d.ts:57

Snapshots taken (for evm_snapshot/evm_revert)
