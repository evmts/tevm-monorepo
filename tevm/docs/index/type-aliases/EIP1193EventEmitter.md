[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / EIP1193EventEmitter

# Type Alias: EIP1193EventEmitter

> **EIP1193EventEmitter** = [`EIP1193Events`](EIP1193Events.md) & `object`

Defined in: packages/node/dist/index.d.ts:47

A very minimal EventEmitter interface

## Type declaration

### emit()

> **emit**(`eventName`, ...`args`): `boolean`

Emit an event.

#### Parameters

##### eventName

keyof [`EIP1193EventMap`](EIP1193EventMap.md)

The event name.

##### args

...`any`[]

Arguments to pass to the event listeners.

#### Returns

`boolean`

True if the event was emitted, false otherwise.
