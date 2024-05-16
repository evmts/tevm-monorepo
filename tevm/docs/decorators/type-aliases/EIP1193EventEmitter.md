[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [decorators](../README.md) / EIP1193EventEmitter

# Type alias: EIP1193EventEmitter

> **EIP1193EventEmitter**: [`EIP1193Events`](../../index/type-aliases/EIP1193Events.md) & `object`

A very minimal EventEmitter interface

## Type declaration

### emit()

Emit an event.

#### Parameters

• **eventName**: keyof [`EIP1193EventMap`](EIP1193EventMap.md)

The event name.

• ...**args**: `any`[]

Arguments to pass to the event listeners.

#### Returns

`boolean`

True if the event was emitted, false otherwise.

## Source

packages/decorators/dist/index.d.ts:1587
