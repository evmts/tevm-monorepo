[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [node](../README.md) / SnapshotMetadata

# Type Alias: SnapshotMetadata

> **SnapshotMetadata** = `object`

## Properties

| Property | Modifier | Type |
| ------ | ------ | ------ |
| <a id="autoimpersonate"></a> `autoImpersonate?` | `public` | `boolean` |
| <a id="blockchain"></a> `blockchain?` | `public` | `object` |
| `blockchain.blocks` | `readonly` | readonly readonly \[`unknown`, `unknown`\][] |
| `blockchain.blocksByNumber` | `readonly` | readonly readonly \[`unknown`, `unknown`\][] |
| `blockchain.blocksByTag` | `readonly` | readonly readonly \[`unknown`, `unknown`\][] |
| <a id="blocktimestampinterval"></a> `blockTimestampInterval?` | `public` | `bigint` |
| <a id="impersonatedaccount"></a> `impersonatedAccount?` | `public` | [`Address`](../../index/type-aliases/Address.md) |
| <a id="mingasprice"></a> `minGasPrice?` | `public` | `bigint` |
| <a id="miningconfig"></a> `miningConfig?` | `public` | [`MiningConfig`](../../index/type-aliases/MiningConfig.md) |
| <a id="nextblockbasefeepergas"></a> `nextBlockBaseFeePerGas?` | `public` | `bigint` |
| <a id="nextblockgaslimit"></a> `nextBlockGasLimit?` | `public` | `bigint` |
| <a id="nextblockprevrandao"></a> `nextBlockPrevRandao?` | `public` | `bigint` |
| <a id="nextblocktimestamp"></a> `nextBlockTimestamp?` | `public` | `bigint` |
| <a id="receiptentries"></a> `receiptEntries?` | `public` | readonly readonly \[`unknown`, `unknown`\][] |
| <a id="txhashes"></a> `txHashes?` | `public` | readonly [`Hex`](../../index/type-aliases/Hex.md)[] |
| <a id="txpooltransactions"></a> `txPoolTransactions?` | `public` | readonly `unknown`[] |
| <a id="version"></a> `version?` | `public` | `number` |
