**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseBytes27

# Function: parseBytes27()

> **parseBytes27**\<`TBytes27`\>(`bytes27`): `TBytes27`

Parses a Bytes27 and returns the value if no errors.

## Type parameters

• **TBytes27** extends ```0x${string}```

## Parameters

• **bytes27**: `TBytes27`

## Returns

`TBytes27`

## Example

```ts
import { parseBytes27 } from '@tevm/schemas';
const parsedBytes27 = parseBytes27('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddbb');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:442](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L442)
