[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / BlockResult

# Type Alias: BlockResult\<TIncludeTransactions\>

> **BlockResult**\<`TIncludeTransactions`\> = `object`

The type returned by block related
json rpc procedures

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TIncludeTransactions` *extends* `boolean` | `false` |

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="difficulty"></a> `difficulty` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) | - |
| <a id="extradata"></a> `extraData` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) | - |
| <a id="gaslimit"></a> `gasLimit` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) | - |
| <a id="gasused"></a> `gasUsed` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) | - |
| <a id="hash"></a> `hash` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) | The hex stringhash of the block. |
| <a id="logsbloom"></a> `logsBloom` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) | - |
| <a id="miner"></a> `miner` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) | - |
| <a id="nonce"></a> `nonce` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) | - |
| <a id="number"></a> `number` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) | The block number (height) in the blockchain. |
| <a id="parenthash"></a> `parentHash` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) | The hex stringhash of the parent block. |
| <a id="sha3uncles"></a> `sha3Uncles` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) | The hex stringhash of the uncles of the block. |
| <a id="size"></a> `size` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) | - |
| <a id="stateroot"></a> `stateRoot` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) | - |
| <a id="timestamp"></a> `timestamp` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) | - |
| <a id="totaldifficulty"></a> `totalDifficulty` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) | - |
| <a id="transactions"></a> `transactions` | `readonly` | `TIncludeTransactions` *extends* `true` ? [`TransactionParams`](TransactionParams.md)[] : [`Hex`](../../actions/type-aliases/Hex.md)[] | - |
| <a id="transactionsroot"></a> `transactionsRoot` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md) | - |
| <a id="uncles"></a> `uncles` | `readonly` | [`Hex`](../../actions/type-aliases/Hex.md)[] | - |
