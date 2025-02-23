[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes32

# Function: parseBytes32()

> **parseBytes32**\<`TBytes32`\>(`bytes32`): `TBytes32`

Parses a Bytes32 and returns the value if no errors.

## Type Parameters

• **TBytes32** *extends* \`0x$\{string\}\`

## Parameters

• **bytes32**: `TBytes32`

## Returns

`TBytes32`

## Example

```ts
import { parseBytes32 } from '@tevm/schemas';
const parsedBytes32 = parseBytes32('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddbbccaaaaaabb');
```

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:516](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L516)
