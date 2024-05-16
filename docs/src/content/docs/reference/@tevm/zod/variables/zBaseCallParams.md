---
editUrl: false
next: false
prev: false
title: "zBaseCallParams"
---

> `const` **zBaseCallParams**: `ZodObject`\<`object`, `"strip"`, `ZodTypeAny`, `object`, `object`\>

## Type declaration

### blobVersionedHashes

> **blobVersionedHashes**: `ZodOptional`\<`ZodArray`\<`ZodEffects`\<`ZodString`, \`0x$\{string\}\`, `string`\>, `"many"`\>\>

### blockOverrideSet

> **blockOverrideSet**: `ZodOptional`\<`ZodObject`\<`object`, `"strict"`, `ZodTypeAny`, `object`, `object`\>\>

### blockTag

> **blockTag**: `ZodOptional`\<`ZodUnion`\<[`ZodLiteral`\<`"latest"`\>, `ZodLiteral`\<`"earliest"`\>, `ZodLiteral`\<`"pending"`\>, `ZodLiteral`\<`"safe"`\>, `ZodLiteral`\<`"finalized"`\>, `ZodBigInt`, `ZodEffects`\<`ZodString`, \`0x$\{string\}\`, `string`\>]\>\>

### caller

> **caller**: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string\}\`, `string`\>\>

### createTrace

> **createTrace**: `ZodOptional`\<`ZodBoolean`\>

### createTransaction

> **createTransaction**: `ZodUnion`\<[`ZodOptional`\<`ZodBoolean`\>, `ZodLiteral`\<`"on-success"`\>, `ZodLiteral`\<`"always"`\>, `ZodLiteral`\<`"never"`\>]\>

### depth

> **depth**: `ZodOptional`\<`ZodNumber`\>

### gas

> **gas**: `ZodOptional`\<`ZodBigInt`\>

### gasPrice

> **gasPrice**: `ZodOptional`\<`ZodBigInt`\>

### gasRefund

> **gasRefund**: `ZodOptional`\<`ZodBigInt`\>

### origin

> **origin**: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string\}\`, `string`\>\>

### selfdestruct

> **selfdestruct**: `ZodOptional`\<`ZodSet`\<`ZodEffects`\<`ZodString`, \`0x$\{string\}\`, `string`\>\>\>

### skipBalance

> **skipBalance**: `ZodOptional`\<`ZodBoolean`\>

### stateOverrideSet

> **stateOverrideSet**: `ZodOptional`\<`ZodRecord`\<`ZodEffects`\<`ZodString`, \`0x$\{string\}\`, `string`\>, `ZodObject`\<`object`, `"strict"`, `ZodTypeAny`, `object`, `object`\>\>\>

### throwOnFail

> **throwOnFail**: `ZodOptional`\<`ZodBoolean`\>

### to

> **to**: `ZodOptional`\<`ZodEffects`\<`ZodString`, \`0x$\{string\}\`, `string`\>\>

### value

> **value**: `ZodOptional`\<`ZodBigInt`\>

## Source

[packages/zod/src/params/zBaseCallParams.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/params/zBaseCallParams.js#L6)
