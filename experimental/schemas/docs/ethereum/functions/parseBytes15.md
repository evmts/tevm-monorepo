[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes15

# Function: parseBytes15()

> **parseBytes15**\<`TBytes15`\>(`bytes15`): `TBytes15`

Parses a Bytes15 and returns the value if no errors.

## Type parameters

• **TBytes15** *extends* \`0x$\{string\}\`

## Parameters

• **bytes15**: `TBytes15`

## Returns

`TBytes15`

## Example

```ts
import { parseBytes15 } from '@tevm/schemas';
const parsedBytes15 = parseBytes15('0xffaabbccddeeffaabbccddaaeeffaaee');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:262](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L262)
