**@tevm/actions-types** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/actions-types](../README.md) / TraceResult

# Type alias: TraceResult

> **TraceResult**: `object`

## Type declaration

### calls?

> **`optional`** **calls**: [`TraceCall`](TraceCall.md)[]

### from

> **from**: [`Address`](Address.md)

### gas

> **gas**: `bigint`

### gasUsed

> **gasUsed**: `bigint`

### input

> **input**: [`Hex`](Hex.md)

### output

> **output**: [`Hex`](Hex.md)

### to

> **to**: [`Address`](Address.md)

### type

> **type**: [`TraceType`](TraceType.md)

### value

> **value**: `bigint`

## Source

[common/TraceResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/common/TraceResult.ts#L6)
