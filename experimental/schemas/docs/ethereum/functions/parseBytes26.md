[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes26

# Function: parseBytes26()

> **parseBytes26**\<`TBytes26`\>(`bytes26`): `TBytes26`

Parses a Bytes26 and returns the value if no errors.

## Type Parameters

• **TBytes26** *extends* \`0x$\{string\}\`

## Parameters

• **bytes26**: `TBytes26`

## Returns

`TBytes26`

## Example

```ts
import { parseBytes26 } from '@tevm/schemas';
const parsedBytes26 = parseBytes26('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddaa');
```

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:427](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L427)
