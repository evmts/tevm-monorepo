**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseBytes25

# Function: parseBytes25()

> **parseBytes25**\<`TBytes25`\>(`bytes25`): `TBytes25`

Parses a Bytes25 and returns the value if no errors.

## Type parameters

• **TBytes25** extends ```0x${string}```

## Parameters

• **bytes25**: `TBytes25`

## Returns

`TBytes25`

## Example

```ts
import { parseBytes25 } from '@tevm/schemas';
const parsedBytes25 = parseBytes25('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbdd');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:412](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L412)
