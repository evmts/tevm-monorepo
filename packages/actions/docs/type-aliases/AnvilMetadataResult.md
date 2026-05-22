[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilMetadataResult

# Type Alias: AnvilMetadataResult

> **AnvilMetadataResult** = `object`

Defined in: [packages/actions/src/anvil/AnvilResult.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L71)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="chainid"></a> `chainId` | `number` | Chain ID | [packages/actions/src/anvil/AnvilResult.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L75) |
| <a id="clientversion"></a> `clientVersion` | `string` | Client version (e.g., "tevm/1.0.0") | [packages/actions/src/anvil/AnvilResult.ts:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L73) |
| <a id="forked"></a> `forked?` | `object` | Whether the node is in fork mode | [packages/actions/src/anvil/AnvilResult.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L77) |
| `forked.blockNumber` | `number` | The block number the fork was created from | [packages/actions/src/anvil/AnvilResult.ts:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L81) |
| `forked.url` | `string` | The URL being forked | [packages/actions/src/anvil/AnvilResult.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L79) |
| <a id="snapshots"></a> `snapshots` | `Record`\<`string`, `string`\> | Snapshots taken (for evm_snapshot/evm_revert) | [packages/actions/src/anvil/AnvilResult.ts:84](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L84) |
