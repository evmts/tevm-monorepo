---
editUrl: false
next: false
prev: false
title: "VMEvents"
---

> **VMEvents**: `object`

## Type declaration

### afterBlock()

> **afterBlock**: (`data`, `resolve`?) => `void`

#### Parameters

• **data**: [`AfterBlockEvent`](/reference/tevm/vm/interfaces/afterblockevent/)

• **resolve?**

#### Returns

`void`

### afterTx()

> **afterTx**: (`data`, `resolve`?) => `void`

#### Parameters

• **data**: [`AfterTxEvent`](/reference/tevm/vm/interfaces/aftertxevent/)

• **resolve?**

#### Returns

`void`

### beforeBlock()

> **beforeBlock**: (`data`, `resolve`?) => `void`

#### Parameters

• **data**: [`Block`](/reference/tevm/block/classes/block/)

• **resolve?**

#### Returns

`void`

### beforeTx()

> **beforeTx**: (`data`, `resolve`?) => `void`

#### Parameters

• **data**: [`TypedTransaction`](/reference/tevm/tx/type-aliases/typedtransaction/)

• **resolve?**

#### Returns

`void`

## Source

[packages/vm/src/utils/types.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L75)
