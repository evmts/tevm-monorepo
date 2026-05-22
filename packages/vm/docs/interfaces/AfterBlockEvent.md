[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / AfterBlockEvent

# Interface: AfterBlockEvent

Defined in: [packages/vm/src/utils/AfterblockEvent.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/AfterblockEvent.ts#L20)

Event data emitted after a block has been processed.
Extends RunBlockResult with the block that was processed.

## Example

```typescript
import { AfterBlockEvent } from '@tevm/vm'
import { VM } from '@tevm/vm'

// Access in VM event handlers
const vm = new VM()
vm.events.on('afterBlock', (event: AfterBlockEvent) => {
  console.log('Block processed:', event.block.header.number)
  console.log('Receipts:', event.receipts)
})
```

## Extends

- [`RunBlockResult`](RunBlockResult.md)

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="block"></a> `block` | `Block` | - | - | [packages/vm/src/utils/AfterblockEvent.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/AfterblockEvent.ts#L22) |
| <a id="gasused"></a> `gasUsed` | `bigint` | The gas used after executing the block | [`ApplyBlockResult`](ApplyBlockResult.md).[`gasUsed`](ApplyBlockResult.md#gasused) | [packages/vm/src/utils/ApplyBlockResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L17) |
| <a id="logsbloom"></a> `logsBloom` | `Uint8Array` | The bloom filter of the LOGs (events) after executing the block | [`RunBlockResult`](RunBlockResult.md).[`logsBloom`](RunBlockResult.md#logsbloom) | [packages/vm/src/utils/RunBlockResult.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L15) |
| <a id="preimages"></a> `preimages?` | `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\> | Preimages mapping of the touched accounts from the block (see reportPreimages option) | [`ApplyBlockResult`](ApplyBlockResult.md).[`preimages`](ApplyBlockResult.md#preimages) | [packages/vm/src/utils/ApplyBlockResult.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L33) |
| <a id="receipts"></a> `receipts` | [`TxReceipt`](../type-aliases/TxReceipt.md)[] | Receipts generated for transactions in the block | [`ApplyBlockResult`](ApplyBlockResult.md).[`receipts`](ApplyBlockResult.md#receipts) | [packages/vm/src/utils/ApplyBlockResult.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L25) |
| <a id="receiptsroot"></a> `receiptsRoot` | `Uint8Array` | The receipt root after executing the block | [`ApplyBlockResult`](ApplyBlockResult.md).[`receiptsRoot`](ApplyBlockResult.md#receiptsroot) | [packages/vm/src/utils/ApplyBlockResult.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L21) |
| <a id="requests"></a> `requests?` | `ClRequest`[] | Any CL requests that were processed in the course of this block | [`RunBlockResult`](RunBlockResult.md).[`requests`](RunBlockResult.md#requests) | [packages/vm/src/utils/RunBlockResult.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L24) |
| <a id="requestsroot"></a> `requestsRoot?` | `Uint8Array`\<`ArrayBufferLike`\> | The requestsRoot for any CL requests in the block | [`RunBlockResult`](RunBlockResult.md).[`requestsRoot`](RunBlockResult.md#requestsroot) | [packages/vm/src/utils/RunBlockResult.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L20) |
| <a id="results"></a> `results` | [`RunTxResult`](RunTxResult.md)[] | Results of executing the transactions in the block | [`ApplyBlockResult`](ApplyBlockResult.md).[`results`](ApplyBlockResult.md#results) | [packages/vm/src/utils/ApplyBlockResult.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/ApplyBlockResult.ts#L29) |
| <a id="stateroot"></a> `stateRoot` | `Uint8Array` | The stateRoot after executing the block | [`RunBlockResult`](RunBlockResult.md).[`stateRoot`](RunBlockResult.md#stateroot) | [packages/vm/src/utils/RunBlockResult.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunBlockResult.ts#L11) |
