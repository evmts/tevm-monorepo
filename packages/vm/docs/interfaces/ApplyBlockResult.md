[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / ApplyBlockResult

# Interface: ApplyBlockResult

Defined in: [packages/vm/src/utils/ApplyBlockResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L9)

Result of [applyBlock](../functions/applyBlock.md)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="bloom"></a> `bloom` | `Bloom` | The Bloom filter | [packages/vm/src/utils/ApplyBlockResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L13) |
| <a id="gasused"></a> `gasUsed` | `bigint` | The gas used after executing the block | [packages/vm/src/utils/ApplyBlockResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L17) |
| <a id="preimages"></a> `preimages?` | `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\> | Preimages mapping of the touched accounts from the block (see reportPreimages option) | [packages/vm/src/utils/ApplyBlockResult.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L33) |
| <a id="receipts"></a> `receipts` | [`TxReceipt`](../type-aliases/TxReceipt.md)[] | Receipts generated for transactions in the block | [packages/vm/src/utils/ApplyBlockResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L25) |
| <a id="receiptsroot"></a> `receiptsRoot` | `Uint8Array` | The receipt root after executing the block | [packages/vm/src/utils/ApplyBlockResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L21) |
| <a id="results"></a> `results` | [`RunTxResult`](RunTxResult.md)[] | Results of executing the transactions in the block | [packages/vm/src/utils/ApplyBlockResult.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L29) |
