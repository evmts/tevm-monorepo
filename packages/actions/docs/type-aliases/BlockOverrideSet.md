[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / BlockOverrideSet

# Type Alias: BlockOverrideSet

> **BlockOverrideSet** = `object`

Defined in: [packages/actions/src/common/BlockOverrideSet.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockOverrideSet.ts#L8)

The fields of this optional object customize the block as part of which the call is simulated. The object contains the following fields:
This option cannot be used when `createTransaction` is set to `true`
Setting the block number to past block will not run in the context of that blocks state. To do that fork that block number first.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="basefee"></a> `baseFee?` | `bigint` | Block base fee (see EIP-1559) | [packages/actions/src/common/BlockOverrideSet.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockOverrideSet.ts#L38) |
| <a id="blobbasefee"></a> `blobBaseFee?` | `bigint` | Block blob base fee (see EIP-4844) | [packages/actions/src/common/BlockOverrideSet.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockOverrideSet.ts#L42) |
| <a id="coinbase"></a> `coinbase?` | `Address` | Block fee recipient | [packages/actions/src/common/BlockOverrideSet.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockOverrideSet.ts#L29) |
| <a id="gaslimit"></a> `gasLimit?` | `bigint` | Block gas capacity | [packages/actions/src/common/BlockOverrideSet.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockOverrideSet.ts#L25) |
| <a id="number"></a> `number?` | `bigint` | Fake block number | [packages/actions/src/common/BlockOverrideSet.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockOverrideSet.ts#L12) |
| <a id="time"></a> `time?` | `bigint` | Fake block timestamp | [packages/actions/src/common/BlockOverrideSet.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockOverrideSet.ts#L21) |
