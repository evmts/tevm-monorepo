[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes17

# Function: parseBytes17()

> **parseBytes17**\<`TBytes17`\>(`bytes17`): `TBytes17`

Parses a Bytes17 and returns the value if no errors.

## Type Parameters

• **TBytes17** *extends* \`0x$\{string\}\`

## Parameters

• **bytes17**: `TBytes17`

## Returns

`TBytes17`

## Example

```ts
import { parseBytes17 } from '@tevm/schemas';
const parsedBytes17 = parseBytes17('0xffaabbccddeeffaabbccddaaeeffaaeeffaa');
```

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:292](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L292)
