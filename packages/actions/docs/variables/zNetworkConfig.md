[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / zNetworkConfig

# Variable: zNetworkConfig

> `const` **zNetworkConfig**: `ZodObject`\<`object`, `"strip"`, `ZodTypeAny`, `object`, `object`\>

## Type declaration

### blockTag

> **blockTag**: `ZodOptional`\<`ZodUnion`\<[`ZodLiteral`\<`"latest"`\>, `ZodLiteral`\<`"earliest"`\>, `ZodLiteral`\<`"pending"`\>, `ZodLiteral`\<`"safe"`\>, `ZodLiteral`\<`"finalized"`\>, `ZodBigInt`, `ZodEffects`\<`ZodString`, \`0x$\{string\}\`, `string`\>]\>\>

### url

> **url**: `ZodString`

## Source

[packages/actions/src/internal/zod/zNetworkConfig.js:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/internal/zod/zNetworkConfig.js#L4)
