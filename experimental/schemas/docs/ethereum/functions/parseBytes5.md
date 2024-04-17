**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseBytes5

# Function: parseBytes5()

> **parseBytes5**\<`TBytes5`\>(`bytes5`): `TBytes5`

Parses a Bytes5 and returns the value if no errors.

## Type parameters

• **TBytes5** extends ```0x${string}```

## Parameters

• **bytes5**: `TBytes5`

## Returns

`TBytes5`

## Example

```ts
import { parseBytes5 } from '@tevm/schemas';
const parsedBytes5 = parseBytes5('0xffaabbccdd');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:114](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L114)
