---
editUrl: false
next: false
prev: false
title: "EIP1193EventEmitter"
---

> **EIP1193EventEmitter**: [`EIP1193Events`](/reference/tevm/base-client/type-aliases/eip1193events/) & `object`

A very minimal EventEmitter interface

## Type declaration

### emit()

Emit an event.

#### Parameters

• **eventName**: keyof [`EIP1193EventMap`](/reference/tevm/base-client/type-aliases/eip1193eventmap/)

The event name.

• ...**args**: `any`[]

Arguments to pass to the event listeners.

#### Returns

`boolean`

True if the event was emitted, false otherwise.

## Source

packages/base-client/src/EIP1193EventEmitterTypes.ts:50
