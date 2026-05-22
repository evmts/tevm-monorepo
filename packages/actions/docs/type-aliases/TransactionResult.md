[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / TransactionResult

# Type Alias: TransactionResult

> **TransactionResult** = `object`

Defined in: [packages/actions/src/common/TransactionResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L7)

The type returned by transaction related
json rpc procedures

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="accesslist"></a> `accessList?` | `readonly` | `ReadonlyArray`\<\{ `address`: [`Hex`](Hex.md); `storageKeys`: `ReadonlyArray`\<[`Hex`](Hex.md)\>; \}\> | [packages/actions/src/common/TransactionResult.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L26) |
| <a id="authorizationlist"></a> `authorizationList?` | `readonly` | `ReadonlyArray`\<\{ `address`: [`Hex`](Hex.md); `chainId`: [`Hex`](Hex.md); `nonce`: [`Hex`](Hex.md); `r`: [`Hex`](Hex.md); `s`: [`Hex`](Hex.md); `yParity`: [`Hex`](Hex.md); \}\> | [packages/actions/src/common/TransactionResult.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L30) |
| <a id="blobversionedhashes"></a> `blobVersionedHashes?` | `readonly` | `ReadonlyArray`\<[`Hex`](Hex.md)\> | [packages/actions/src/common/TransactionResult.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L39) |
| <a id="blockhash"></a> `blockHash` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L8) |
| <a id="blocknumber"></a> `blockNumber` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L9) |
| <a id="chainid"></a> `chainId?` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L22) |
| <a id="from"></a> `from` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L10) |
| <a id="gas"></a> `gas` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L11) |
| <a id="gasprice"></a> `gasPrice` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L12) |
| <a id="hash"></a> `hash` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L13) |
| <a id="input"></a> `input` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L14) |
| <a id="isimpersonated"></a> `isImpersonated?` | `readonly` | `boolean` | [packages/actions/src/common/TransactionResult.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L40) |
| <a id="maxfeeperblobgas"></a> `maxFeePerBlobGas?` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L38) |
| <a id="maxfeepergas"></a> `maxFeePerGas?` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L23) |
| <a id="maxpriorityfeepergas"></a> `maxPriorityFeePerGas?` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L24) |
| <a id="nonce"></a> `nonce` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L15) |
| <a id="r"></a> `r` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L20) |
| <a id="s"></a> `s` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L21) |
| <a id="to"></a> `to` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L16) |
| <a id="transactionindex"></a> `transactionIndex` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L17) |
| <a id="type"></a> `type?` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L25) |
| <a id="v"></a> `v` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L19) |
| <a id="value"></a> `value` | `readonly` | [`Hex`](Hex.md) | [packages/actions/src/common/TransactionResult.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/TransactionResult.ts#L18) |
