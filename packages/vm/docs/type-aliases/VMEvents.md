[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / VMEvents

# Type alias: VMEvents

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

• **data**: `Block`

• **resolve?**

#### Returns

`void`

### beforeTx()

> **beforeTx**: (`data`, `resolve`?) => `void`

#### Parameters

• **data**: `TypedTransaction`

• **resolve?**

#### Returns

`void`

## Source

[packages/vm/src/utils/types.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L75)
