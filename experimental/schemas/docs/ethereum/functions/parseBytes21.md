[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes21

# Function: parseBytes21()

> **parseBytes21**\<`TBytes21`\>(`bytes21`): `TBytes21`

Parses a Bytes21 and returns the value if no errors.

## Type Parameters

• **TBytes21** *extends* \`0x$\{string\}\`

## Parameters

• **bytes21**: `TBytes21`

## Returns

`TBytes21`

## Example

```ts
import { parseBytes21 } from '@tevm/schemas';
const parsedBytes21 = parseBytes21('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddaa');
```

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:352](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L352)
