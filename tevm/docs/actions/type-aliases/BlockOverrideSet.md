[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / BlockOverrideSet

# Type Alias: BlockOverrideSet

> **BlockOverrideSet** = `object`

The fields of this optional object customize the block as part of which the call is simulated. The object contains the following fields:
This option cannot be used when `createTransaction` is set to `true`
Setting the block number to past block will not run in the context of that blocks state. To do that fork that block number first.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="basefee"></a> `baseFee?` | `bigint` | Block base fee (see EIP-1559) |
| <a id="blobbasefee"></a> `blobBaseFee?` | `bigint` | Block blob base fee (see EIP-4844) |
| <a id="coinbase"></a> `coinbase?` | [`Address`](../../index/type-aliases/Address.md) | Block fee recipient |
| <a id="gaslimit"></a> `gasLimit?` | `bigint` | Block gas capacity |
| <a id="number"></a> `number?` | `bigint` | Fake block number |
| <a id="time"></a> `time?` | `bigint` | Fake block timestamp |
