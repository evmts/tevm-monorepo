[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / TransactionResult

# Type Alias: TransactionResult

> **TransactionResult** = `object`

The type returned by transaction related
json rpc procedures

## Properties

| Property | Modifier | Type |
| ------ | ------ | ------ |
| <a id="accesslist"></a> `accessList?` | `readonly` | `ReadonlyArray`\<\{ `address`: [`Hex`](../../actions/type-aliases/Hex.md); `storageKeys`: `ReadonlyArray`\<[`Hex`](../../actions/type-aliases/Hex.md)\>; \}\> |
| <a id="authorizationlist"></a> `authorizationList?` | `readonly` | `ReadonlyArray`\<\{ `address`: [`Hex`](../../actions/type-aliases/Hex.md); `chainId`: [`Hex`](../../actions/type-aliases/Hex.md); `nonce`: [`Hex`](../../actions/type-aliases/Hex.md); `r`: [`Hex`](../../actions/type-aliases/Hex.md); `s`: [`Hex`](../../actions/type-aliases/Hex.md); `yParity`: [`Hex`](../../actions/type-aliases/Hex.md); \}\> |
| <a id="blobversionedhashes"></a> `blobVersionedHashes?` | `readonly` | `ReadonlyArray`\<[`Hex`](../../actions/type-aliases/Hex.md)\> |
| <a id="blockhash"></a> `blockHash` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="blocknumber"></a> `blockNumber` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="chainid"></a> `chainId?` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="from"></a> `from` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="gas"></a> `gas` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="gasprice"></a> `gasPrice` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="hash"></a> `hash` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="input"></a> `input` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="isimpersonated"></a> `isImpersonated?` | `readonly` | `boolean` |
| <a id="maxfeeperblobgas"></a> `maxFeePerBlobGas?` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="maxfeepergas"></a> `maxFeePerGas?` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="maxpriorityfeepergas"></a> `maxPriorityFeePerGas?` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="nonce"></a> `nonce` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="r"></a> `r` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="s"></a> `s` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="to"></a> `to` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="transactionindex"></a> `transactionIndex` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="type"></a> `type?` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="v"></a> `v` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
| <a id="value"></a> `value` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) |
