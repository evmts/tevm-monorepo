[**@tevm/test-matchers**](../README.md)

***

[@tevm/test-matchers](../globals.md) / EqualHexOptions

# Type Alias: EqualHexOptions

> **EqualHexOptions** = `object`

Defined in: [extensions/test-matchers/src/matchers/utils/toEqualHex.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-matchers/src/matchers/utils/toEqualHex.ts#L4)

## Properties

### exact?

> `optional` **exact**: `boolean`

Defined in: [extensions/test-matchers/src/matchers/utils/toEqualHex.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-matchers/src/matchers/utils/toEqualHex.ts#L11)

Whether to compare hex strings exactly as written or normalize them first.
When false (default), leading zeros are trimmed before byte comparison (e.g., "0x00123" equals "0x123").
When true, hex strings must match exactly including leading zeros.

#### Default

```ts
false
```
