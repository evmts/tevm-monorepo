**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseBytes31

# Function: parseBytes31()

> **parseBytes31**\<`TBytes31`\>(`bytes31`): `TBytes31`

Parses a Bytes31 and returns the value if no errors.

## Type parameters

▪ **TBytes31** extends \`0x${string}\`

## Parameters

▪ **bytes31**: `TBytes31`

## Returns

## Example

```ts
import { parseBytes31 } from '@tevm/schemas';
const parsedBytes31 = parseBytes31('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddbbccaaaaaa');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:501](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L501)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
