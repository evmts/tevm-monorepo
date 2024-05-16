[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes24

# Function: parseBytes24()

> **parseBytes24**\<`TBytes24`\>(`bytes24`): `TBytes24`

Parses a Bytes24 and returns the value if no errors.

## Type parameters

• **TBytes24** *extends* \`0x$\{string\}\`

## Parameters

• **bytes24**: `TBytes24`

## Returns

`TBytes24`

## Example

```ts
import { parseBytes24 } from '@tevm/schemas';
const parsedBytes24 = parseBytes24('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbb');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:397](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L397)
