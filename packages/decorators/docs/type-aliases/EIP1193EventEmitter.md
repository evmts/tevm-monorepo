**@tevm/decorators** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > EIP1193EventEmitter

# Type alias: EIP1193EventEmitter

> **EIP1193EventEmitter**: [`EIP1193Events`](EIP1193Events.md) & `object`

A very minimal EventEmitter interface

## Type declaration

### emit()

Emit an event.

#### Parameters

▪ **eventName**: keyof [`EIP1193EventMap`](EIP1193EventMap.md)

The event name.

▪ ...**args**: `any`[]

Arguments to pass to the event listeners.

#### Returns

True if the event was emitted, false otherwise.

## Source

[packages/decorators/src/events/EIP1193EventEmitter.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/events/EIP1193EventEmitter.ts#L9)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
