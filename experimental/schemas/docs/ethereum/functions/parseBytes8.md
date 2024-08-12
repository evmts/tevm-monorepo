[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes8

# Function: parseBytes8()

> **parseBytes8**\<`TBytes8`\>(`bytes8`): `TBytes8`

Parses a Bytes8 and returns the value if no errors.

## Type Parameters

• **TBytes8** *extends* \`0x$\{string\}\`

## Parameters

• **bytes8**: `TBytes8`

## Returns

`TBytes8`

## Example

```ts
import { parseBytes8 } from '@tevm/schemas';
const parsedBytes8 = parseBytes8('0xffaabbccddeeffaabb');
```

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:158](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L158)
