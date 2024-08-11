[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes7

# Function: parseBytes7()

> **parseBytes7**\<`TBytes7`\>(`bytes7`): `TBytes7`

Parses a Bytes7 and returns the value if no errors.

## Type Parameters

• **TBytes7** *extends* \`0x$\{string\}\`

## Parameters

• **bytes7**: `TBytes7`

## Returns

`TBytes7`

## Example

```ts
import { parseBytes7 } from '@tevm/schemas';
const parsedBytes7 = parseBytes7('0xffaabbccddeeffaa');
```

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:143](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L143)
