**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes

# Function: isBytes()

> **isBytes**(`value`): `boolean`

Type guard that returns true if a string is a valid hex string.

## Parameters

▪ **value**: `string`

The string to check.

## Returns

- True if the string is a valid hex string.

## Example

```javascript
import { isBytes } from '@tevm/schemas';
const hex = '0x1234567890abcdef1234567890abcdef12345678';
const isHex = isBytes(hex);
```

## Source

[packages/schemas/src/ethereum/SBytes/isBytes.js:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytes/isBytes.js#L22)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
