[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / VMEvents

# Type Alias: VMEvents

> **VMEvents**: `object`

Defined in: packages/vm/types/utils/VMEvents.d.ts:5

## Type declaration

### afterBlock()

> **afterBlock**: (`data`, `resolve`?) => `void`

#### Parameters

##### data

[`AfterBlockEvent`](../interfaces/AfterBlockEvent.md)

##### resolve?

(`result`?) => `void`

#### Returns

`void`

### afterTx()

> **afterTx**: (`data`, `resolve`?) => `void`

#### Parameters

##### data

[`AfterTxEvent`](../interfaces/AfterTxEvent.md)

##### resolve?

(`result`?) => `void`

#### Returns

`void`

### beforeBlock()

> **beforeBlock**: (`data`, `resolve`?) => `void`

#### Parameters

##### data

[`Block`](../../block/classes/Block.md)

##### resolve?

(`result`?) => `void`

#### Returns

`void`

### beforeTx()

> **beforeTx**: (`data`, `resolve`?) => `void`

#### Parameters

##### data

[`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)

##### resolve?

(`result`?) => `void`

#### Returns

`void`
