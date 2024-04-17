**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseBytes31

# Function: parseBytes31()

> **parseBytes31**\<`TBytes31`\>(`bytes31`): `TBytes31`

Parses a Bytes31 and returns the value if no errors.

## Type parameters

• **TBytes31** extends ```0x${string}```

## Parameters

• **bytes31**: `TBytes31`

## Returns

`TBytes31`

## Example

```ts
import { parseBytes31 } from '@tevm/schemas';
const parsedBytes31 = parseBytes31('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddbbccaaaaaa');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:501](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L501)
