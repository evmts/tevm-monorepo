[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes23

# Function: parseBytes23()

> **parseBytes23**\<`TBytes23`\>(`bytes23`): `TBytes23`

Parses a Bytes23 and returns the value if no errors.

## Type parameters

• **TBytes23** *extends* \`0x$\{string\}\`

## Parameters

• **bytes23**: `TBytes23`

## Returns

`TBytes23`

## Example

```ts
import { parseBytes23 } from '@tevm/schemas';
const parsedBytes23 = parseBytes23('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddcc');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:382](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L382)
