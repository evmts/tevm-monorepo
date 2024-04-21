**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytesSafe

# Function: parseBytesSafe()

> **parseBytesSafe**\<`TBytes`\>(`value`): `Effect`\<`never`, [`InvalidBytesError`](../classes/InvalidBytesError.md), `TBytes`\>

Safely parses a Bytes into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

▪ **TBytes** extends \`0x${string}\`

## Parameters

▪ **value**: `TBytes`

## Returns

## Example

```javascript
import { parseBytesSafe } from '@tevm/schemas';
const parsedBytesEffect = parseBytesSafe('0x1234567890abcdef1234567890abcdef12345678');
```

## Source

[experimental/schemas/src/ethereum/SBytes/parseBytesSafe.js:23](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytes/parseBytesSafe.js#L23)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
