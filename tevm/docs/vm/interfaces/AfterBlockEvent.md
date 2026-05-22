[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / AfterBlockEvent

# Interface: AfterBlockEvent

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

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="block"></a> `block` | [`Block`](../../block/classes/Block.md) | - | - |
| <a id="gasused"></a> `gasUsed` | `bigint` | The gas used after executing the block | [`ApplyBlockResult`](ApplyBlockResult.md).[`gasUsed`](ApplyBlockResult.md#gasused) |
| <a id="logsbloom"></a> `logsBloom` | `Uint8Array` | The bloom filter of the LOGs (events) after executing the block | [`RunBlockResult`](RunBlockResult.md).[`logsBloom`](RunBlockResult.md#logsbloom) |
| <a id="preimages"></a> `preimages?` | `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\> | Preimages mapping of the touched accounts from the block (see reportPreimages option) | [`ApplyBlockResult`](ApplyBlockResult.md).[`preimages`](ApplyBlockResult.md#preimages) |
| <a id="receipts"></a> `receipts` | [`TxReceipt`](../type-aliases/TxReceipt.md)[] | Receipts generated for transactions in the block | [`ApplyBlockResult`](ApplyBlockResult.md).[`receipts`](ApplyBlockResult.md#receipts) |
| <a id="receiptsroot"></a> `receiptsRoot` | `Uint8Array` | The receipt root after executing the block | [`ApplyBlockResult`](ApplyBlockResult.md).[`receiptsRoot`](ApplyBlockResult.md#receiptsroot) |
| <a id="requests"></a> `requests?` | [`ClRequest`](../../block/classes/ClRequest.md)[] | Any CL requests that were processed in the course of this block | [`RunBlockResult`](RunBlockResult.md).[`requests`](RunBlockResult.md#requests) |
| <a id="requestsroot"></a> `requestsRoot?` | `Uint8Array`\<`ArrayBufferLike`\> | The requestsRoot for any CL requests in the block | [`RunBlockResult`](RunBlockResult.md).[`requestsRoot`](RunBlockResult.md#requestsroot) |
| <a id="results"></a> `results` | [`RunTxResult`](RunTxResult.md)[] | Results of executing the transactions in the block | [`ApplyBlockResult`](ApplyBlockResult.md).[`results`](ApplyBlockResult.md#results) |
| <a id="stateroot"></a> `stateRoot` | `Uint8Array` | The stateRoot after executing the block | [`RunBlockResult`](RunBlockResult.md).[`stateRoot`](RunBlockResult.md#stateroot) |
