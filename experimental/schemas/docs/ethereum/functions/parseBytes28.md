**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseBytes28

# Function: parseBytes28()

> **parseBytes28**\<`TBytes28`\>(`bytes28`): `TBytes28`

Parses a Bytes28 and returns the value if no errors.

## Type parameters

• **TBytes28** extends ```0x${string}```

## Parameters

• **bytes28**: `TBytes28`

## Returns

`TBytes28`

## Example

```ts
import { parseBytes28 } from '@tevm/schemas';
const parsedBytes28 = parseBytes28('0xffaabbccddeeffaabbccddaaeeffaaeeffbbccddccbbddbbcc');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:456](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L456)
