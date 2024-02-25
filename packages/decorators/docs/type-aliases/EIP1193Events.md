**@tevm/decorators** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > EIP1193Events

# Type alias: EIP1193Events

> **EIP1193Events**: `object`

## Type declaration

### on()

#### Type parameters

▪ **TEvent** extends keyof [`EIP1193EventMap`](EIP1193EventMap.md)

#### Parameters

▪ **event**: `TEvent`

▪ **listener**: [`EIP1193EventMap`](EIP1193EventMap.md)[`TEvent`]

### removeListener()

#### Type parameters

▪ **TEvent** extends keyof [`EIP1193EventMap`](EIP1193EventMap.md)

#### Parameters

▪ **event**: `TEvent`

▪ **listener**: [`EIP1193EventMap`](EIP1193EventMap.md)[`TEvent`]

## Source

[packages/decorators/src/eip1193/EIP1193Events.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Events.ts#L36)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
