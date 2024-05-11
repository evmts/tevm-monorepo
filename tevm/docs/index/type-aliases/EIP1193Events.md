**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > EIP1193Events

# Type alias: EIP1193Events

> **EIP1193Events**: `object`

## Type declaration

### on()

#### Type parameters

▪ **TEvent** extends keyof [`EIP1193EventMap`](../../decorators/type-aliases/EIP1193EventMap.md)

#### Parameters

▪ **event**: `TEvent`

▪ **listener**: [`EIP1193EventMap`](../../decorators/type-aliases/EIP1193EventMap.md)[`TEvent`]

### removeListener()

#### Type parameters

▪ **TEvent** extends keyof [`EIP1193EventMap`](../../decorators/type-aliases/EIP1193EventMap.md)

#### Parameters

▪ **event**: `TEvent`

▪ **listener**: [`EIP1193EventMap`](../../decorators/type-aliases/EIP1193EventMap.md)[`TEvent`]

## Source

packages/decorators/dist/index.d.ts:276

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
