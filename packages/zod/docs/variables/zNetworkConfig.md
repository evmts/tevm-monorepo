**@tevm/zod** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/zod](../README.md) / zNetworkConfig

# Variable: zNetworkConfig

> **`const`** **zNetworkConfig**: `ZodObject`\<`object`, `"strip"`, `ZodTypeAny`, `object`, `object`\>

## Type declaration

### blockTag

> **blockTag**: `ZodOptional`\<`ZodUnion`\<[`ZodLiteral`\<`"latest"`\>, `ZodLiteral`\<`"earliest"`\>, `ZodLiteral`\<`"pending"`\>, `ZodLiteral`\<`"safe"`\>, `ZodLiteral`\<`"finalized"`\>, `ZodBigInt`, `ZodEffects`\<`ZodString`, ```0x${string}```, `string`\>]\>\>

### url

> **url**: `ZodString`

## Source

[packages/zod/src/common/zNetworkConfig.js:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/common/zNetworkConfig.js#L4)
