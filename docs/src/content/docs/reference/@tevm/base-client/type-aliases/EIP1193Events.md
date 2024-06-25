---
editUrl: false
next: false
prev: false
title: "EIP1193Events"
---

> **EIP1193Events**: `object`

## Type declaration

### on()

#### Type Parameters

• **TEvent** *extends* keyof [`EIP1193EventMap`](/reference/tevm/base-client/type-aliases/eip1193eventmap/)

#### Parameters

• **event**: `TEvent`

• **listener**: [`EIP1193EventMap`](/reference/tevm/base-client/type-aliases/eip1193eventmap/)\[`TEvent`\]

#### Returns

`void`

### removeListener()

#### Type Parameters

• **TEvent** *extends* keyof [`EIP1193EventMap`](/reference/tevm/base-client/type-aliases/eip1193eventmap/)

#### Parameters

• **event**: `TEvent`

• **listener**: [`EIP1193EventMap`](/reference/tevm/base-client/type-aliases/eip1193eventmap/)\[`TEvent`\]

#### Returns

`void`

## Defined in

[packages/base-client/src/EIP1193EventEmitterTypes.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/EIP1193EventEmitterTypes.ts#L46)
