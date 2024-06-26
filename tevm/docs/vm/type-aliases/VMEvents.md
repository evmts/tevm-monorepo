[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [vm](../README.md) / VMEvents

# Type Alias: VMEvents

> **VMEvents**: `object`

## Type declaration

### afterBlock()

> **afterBlock**: (`data`, `resolve`?) => `void`

#### Parameters

• **data**: [`AfterBlockEvent`](../interfaces/AfterBlockEvent.md)

• **resolve?**

#### Returns

`void`

### afterTx()

> **afterTx**: (`data`, `resolve`?) => `void`

#### Parameters

• **data**: [`AfterTxEvent`](../interfaces/AfterTxEvent.md)

• **resolve?**

#### Returns

`void`

### beforeBlock()

> **beforeBlock**: (`data`, `resolve`?) => `void`

#### Parameters

• **data**: [`Block`](../../block/classes/Block.md)

• **resolve?**

#### Returns

`void`

### beforeTx()

> **beforeTx**: (`data`, `resolve`?) => `void`

#### Parameters

• **data**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)

• **resolve?**

#### Returns

`void`

## Defined in

packages/vm/types/utils/types.d.ts:67
