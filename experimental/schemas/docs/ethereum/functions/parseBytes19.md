[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes19

# Function: parseBytes19()

> **parseBytes19**\<`TBytes19`\>(`bytes19`): `TBytes19`

Parses a Bytes19 and returns the value if no errors.

## Type Parameters

• **TBytes19** *extends* \`0x$\{string\}\`

## Parameters

• **bytes19**: `TBytes19`

## Returns

`TBytes19`

## Example

```ts
import { parseBytes19 } from '@tevm/schemas';
const parsedBytes19 = parseBytes19('0xffaabbccddeeffaabbccddaaeeffaaeeffbbcc');
```

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:322](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L322)
