[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / EIP1193EventEmitter

# Type alias: EIP1193EventEmitter

> **EIP1193EventEmitter**: [`EIP1193Events`](EIP1193Events.md) & `object`

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

packages/base-client/dist/index.d.ts:47
