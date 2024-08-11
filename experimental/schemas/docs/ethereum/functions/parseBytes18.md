[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes18

# Function: parseBytes18()

> **parseBytes18**\<`TBytes18`\>(`bytes18`): `TBytes18`

Parses a Bytes18 and returns the value if no errors.

## Type Parameters

• **TBytes18** *extends* \`0x$\{string\}\`

## Parameters

• **bytes18**: `TBytes18`

## Returns

`TBytes18`

## Example

```ts
import { parseBytes18 } from '@tevm/schemas';
const parsedBytes18 = parseBytes18('0xffaabbccddeeffaabbccddaaeeffaaeeffbb');
```

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:307](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L307)
