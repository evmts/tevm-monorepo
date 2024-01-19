**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes

# Function: parseBytes()

> **parseBytes**\<`TBytes`\>(`hex`): `TBytes`

Parses a Bytes and returns the value if no errors.

## Type parameters

▪ **TBytes** extends \`0x${string}\`

## Parameters

▪ **hex**: `TBytes`

## Returns

## Example

```javascript
import { parseBytes } from '@tevm/schemas';
const parsedBytes = parseBytes('0x1234567890abcdef1234567890abcdef12345678');
```

## Source

[packages/schemas/src/ethereum/SBytes/parseBytes.js:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytes/parseBytes.js#L20)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
