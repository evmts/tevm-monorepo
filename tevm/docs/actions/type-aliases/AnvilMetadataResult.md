[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / AnvilMetadataResult

# Type Alias: AnvilMetadataResult

> **AnvilMetadataResult** = `object`

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="chainid"></a> `chainId` | `number` | Chain ID |
| <a id="clientversion"></a> `clientVersion` | `string` | Client version (e.g., "tevm/1.0.0") |
| <a id="forked"></a> `forked?` | `object` | Whether the node is in fork mode |
| `forked.blockNumber` | `number` | The block number the fork was created from |
| `forked.url` | `string` | The URL being forked |
| <a id="snapshots"></a> `snapshots` | `Record`\<`string`, `string`\> | Snapshots taken (for evm_snapshot/evm_revert) |
