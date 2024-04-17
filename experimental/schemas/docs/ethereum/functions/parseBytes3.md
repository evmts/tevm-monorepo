**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseBytes3

# Function: parseBytes3()

> **parseBytes3**\<`TBytes3`\>(`bytes3`): `TBytes3`

Parses a Bytes3 and returns the value if no errors.

## Type parameters

• **TBytes3** extends ```0x${string}```

## Parameters

• **bytes3**: `TBytes3`

## Returns

`TBytes3`

## Example

```ts
import { parseBytes3 } from '@tevm/schemas';
const parsedBytes3 = parseBytes3('0xffaabb');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:84](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L84)
