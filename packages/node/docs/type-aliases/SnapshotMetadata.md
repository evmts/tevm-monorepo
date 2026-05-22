[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / SnapshotMetadata

# Type Alias: SnapshotMetadata

> **SnapshotMetadata** = `object`

Defined in: [packages/node/src/TevmNode.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L16)

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="autoimpersonate"></a> `autoImpersonate?` | `public` | `boolean` | [packages/node/src/TevmNode.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L26) |
| <a id="blockchain"></a> `blockchain?` | `public` | `object` | [packages/node/src/TevmNode.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L30) |
| `blockchain.blocks` | `readonly` | readonly readonly \[`unknown`, `unknown`\][] | [packages/node/src/TevmNode.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L31) |
| `blockchain.blocksByNumber` | `readonly` | readonly readonly \[`unknown`, `unknown`\][] | [packages/node/src/TevmNode.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L32) |
| `blockchain.blocksByTag` | `readonly` | readonly readonly \[`unknown`, `unknown`\][] | [packages/node/src/TevmNode.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L33) |
| <a id="blocktimestampinterval"></a> `blockTimestampInterval?` | `public` | `bigint` | [packages/node/src/TevmNode.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L20) |
| <a id="impersonatedaccount"></a> `impersonatedAccount?` | `public` | `Address` | [packages/node/src/TevmNode.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L25) |
| <a id="mingasprice"></a> `minGasPrice?` | `public` | `bigint` | [packages/node/src/TevmNode.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L24) |
| <a id="miningconfig"></a> `miningConfig?` | `public` | [`MiningConfig`](MiningConfig.md) | [packages/node/src/TevmNode.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L17) |
| <a id="nextblockbasefeepergas"></a> `nextBlockBaseFeePerGas?` | `public` | `bigint` | [packages/node/src/TevmNode.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L22) |
| <a id="nextblockgaslimit"></a> `nextBlockGasLimit?` | `public` | `bigint` | [packages/node/src/TevmNode.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L21) |
| <a id="nextblockprevrandao"></a> `nextBlockPrevRandao?` | `public` | `bigint` | [packages/node/src/TevmNode.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L23) |
| <a id="nextblocktimestamp"></a> `nextBlockTimestamp?` | `public` | `bigint` | [packages/node/src/TevmNode.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L19) |
| <a id="receiptentries"></a> `receiptEntries?` | `public` | readonly readonly \[`unknown`, `unknown`\][] | [packages/node/src/TevmNode.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L29) |
| <a id="txhashes"></a> `txHashes?` | `public` | readonly `Hex`[] | [packages/node/src/TevmNode.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L27) |
| <a id="txpooltransactions"></a> `txPoolTransactions?` | `public` | readonly `unknown`[] | [packages/node/src/TevmNode.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L28) |
| <a id="version"></a> `version?` | `public` | `number` | [packages/node/src/TevmNode.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/TevmNode.ts#L18) |
