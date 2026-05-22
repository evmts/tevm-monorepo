[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / BlockResult

# Type Alias: BlockResult\<TIncludeTransactions\>

> **BlockResult**\<`TIncludeTransactions`\> = `object`

Defined in: [packages/actions/src/common/BlockResult.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L8)

The type returned by block related
json rpc procedures

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TIncludeTransactions` *extends* `boolean` | `false` |

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="difficulty"></a> `difficulty` | `readonly` | [`Hex`](Hex.md) | - | [packages/actions/src/common/BlockResult.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L30) |
| <a id="extradata"></a> `extraData` | `readonly` | [`Hex`](Hex.md) | - | [packages/actions/src/common/BlockResult.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L32) |
| <a id="gaslimit"></a> `gasLimit` | `readonly` | [`Hex`](Hex.md) | - | [packages/actions/src/common/BlockResult.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L34) |
| <a id="gasused"></a> `gasUsed` | `readonly` | [`Hex`](Hex.md) | - | [packages/actions/src/common/BlockResult.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L35) |
| <a id="hash"></a> `hash` | `readonly` | [`Hex`](Hex.md) | The hex stringhash of the block. | [packages/actions/src/common/BlockResult.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L16) |
| <a id="logsbloom"></a> `logsBloom` | `readonly` | [`Hex`](Hex.md) | - | [packages/actions/src/common/BlockResult.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L26) |
| <a id="miner"></a> `miner` | `readonly` | [`Hex`](Hex.md) | - | [packages/actions/src/common/BlockResult.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L29) |
| <a id="nonce"></a> `nonce` | `readonly` | [`Hex`](Hex.md) | - | [packages/actions/src/common/BlockResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L21) |
| <a id="number"></a> `number` | `readonly` | [`Hex`](Hex.md) | The block number (height) in the blockchain. | [packages/actions/src/common/BlockResult.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L12) |
| <a id="parenthash"></a> `parentHash` | `readonly` | [`Hex`](Hex.md) | The hex stringhash of the parent block. | [packages/actions/src/common/BlockResult.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L20) |
| <a id="sha3uncles"></a> `sha3Uncles` | `readonly` | [`Hex`](Hex.md) | The hex stringhash of the uncles of the block. | [packages/actions/src/common/BlockResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L25) |
| <a id="size"></a> `size` | `readonly` | [`Hex`](Hex.md) | - | [packages/actions/src/common/BlockResult.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L33) |
| <a id="stateroot"></a> `stateRoot` | `readonly` | [`Hex`](Hex.md) | - | [packages/actions/src/common/BlockResult.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L28) |
| <a id="timestamp"></a> `timestamp` | `readonly` | [`Hex`](Hex.md) | - | [packages/actions/src/common/BlockResult.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L36) |
| <a id="totaldifficulty"></a> `totalDifficulty` | `readonly` | [`Hex`](Hex.md) | - | [packages/actions/src/common/BlockResult.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L31) |
| <a id="transactions"></a> `transactions` | `readonly` | `TIncludeTransactions` *extends* `true` ? [`TransactionParams`](TransactionParams.md)[] : [`Hex`](Hex.md)[] | - | [packages/actions/src/common/BlockResult.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L37) |
| <a id="transactionsroot"></a> `transactionsRoot` | `readonly` | [`Hex`](Hex.md) | - | [packages/actions/src/common/BlockResult.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L27) |
| <a id="uncles"></a> `uncles` | `readonly` | [`Hex`](Hex.md)[] | - | [packages/actions/src/common/BlockResult.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/BlockResult.ts#L38) |
