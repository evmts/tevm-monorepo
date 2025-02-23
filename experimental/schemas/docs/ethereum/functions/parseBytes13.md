[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes13

# Function: parseBytes13()

> **parseBytes13**\<`TBytes13`\>(`bytes13`): `TBytes13`

Parses a Bytes13 and returns the value if no errors.

## Type Parameters

• **TBytes13** *extends* \`0x$\{string\}\`

## Parameters

• **bytes13**: `TBytes13`

## Returns

`TBytes13`

## Example

```ts
import { parseBytes13 } from '@tevm/schemas';
const parsedBytes13 = parseBytes13('0xffaabbccddeeffaabbccddaaeeff');
```

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:232](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L232)
