**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseBytes6

# Function: parseBytes6()

> **parseBytes6**\<`TBytes6`\>(`bytes6`): `TBytes6`

Parses a Bytes6 and returns the value if no errors.

## Type parameters

• **TBytes6** extends ```0x${string}```

## Parameters

• **bytes6**: `TBytes6`

## Returns

`TBytes6`

## Example

```ts
import { parseBytes6 } from '@tevm/schemas';
const parsedBytes6 = parseBytes6('0xffaabbccddeeff');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:128](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L128)
