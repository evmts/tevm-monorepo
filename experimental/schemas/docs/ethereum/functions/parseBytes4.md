**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseBytes4

# Function: parseBytes4()

> **parseBytes4**\<`TBytes4`\>(`bytes4`): `TBytes4`

Parses a Bytes4 and returns the value if no errors.

## Type parameters

• **TBytes4** extends ```0x${string}```

## Parameters

• **bytes4**: `TBytes4`

## Returns

`TBytes4`

## Example

```ts
import { parseBytes4 } from '@tevm/schemas';
const parsedBytes4 = parseBytes4('0xffaabbcc');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:99](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L99)
