---
editUrl: false
next: false
prev: false
title: "EIP1193Events"
---

> **EIP1193Events**: `object`

## Type declaration

### on()

#### Type parameters

• **TEvent** *extends* keyof [`EIP1193EventMap`](/reference/tevm/decorators/type-aliases/eip1193eventmap/)

#### Parameters

• **event**: `TEvent`

• **listener**: [`EIP1193EventMap`](/reference/tevm/decorators/type-aliases/eip1193eventmap/)\[`TEvent`\]

#### Returns

`void`

### removeListener()

#### Type parameters

• **TEvent** *extends* keyof [`EIP1193EventMap`](/reference/tevm/decorators/type-aliases/eip1193eventmap/)

#### Parameters

• **event**: `TEvent`

• **listener**: [`EIP1193EventMap`](/reference/tevm/decorators/type-aliases/eip1193eventmap/)\[`TEvent`\]

#### Returns

`void`

## Source

[packages/decorators/src/eip1193/EIP1193Events.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Events.ts#L36)
