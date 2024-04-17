**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseBytes16

# Function: parseBytes16()

> **parseBytes16**\<`TBytes16`\>(`bytes16`): `TBytes16`

Parses a Bytes16 and returns the value if no errors.

## Type parameters

• **TBytes16** extends ```0x${string}```

## Parameters

• **bytes16**: `TBytes16`

## Returns

`TBytes16`

## Example

```ts
import { parseBytes16 } from '@tevm/schemas';
const parsedBytes16 = parseBytes16('0xffaabbccddeeffaabbccddaaeeffaaeeff');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:277](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L277)
