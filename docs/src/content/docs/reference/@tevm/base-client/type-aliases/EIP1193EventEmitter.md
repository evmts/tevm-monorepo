---
editUrl: false
next: false
prev: false
title: "EIP1193EventEmitter"
---

> **EIP1193EventEmitter**: [`EIP1193Events`](/reference/tevm/node/type-aliases/eip1193events/) & `object`

A very minimal EventEmitter interface

## Type declaration

### emit()

Emit an event.

#### Parameters

• **eventName**: keyof [`EIP1193EventMap`](/reference/tevm/node/type-aliases/eip1193eventmap/)

The event name.

• ...**args**: `any`[]

Arguments to pass to the event listeners.

#### Returns

`boolean`

True if the event was emitted, false otherwise.

## Defined in

[packages/node/src/EIP1193EventEmitterTypes.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L53)
