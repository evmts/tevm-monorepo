**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseUINT32

# Function: parseUINT32()

> **parseUINT32**\<`TUINT32`\>(`uint32`): `TUINT32`

Parses a UINT32 and returns the value if no errors.

## Type parameters

• **TUINT32** extends `bigint`

## Parameters

• **uint32**: `TUINT32`

## Returns

`TUINT32`

## Example

```ts
import { parseUINT32 } from '@tevm/schemas';
const parsedUINT32 = parseUINT32(BigInt(2147483647));
```

## Source

[experimental/schemas/src/ethereum/SUINT/parseUINT.js:56](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SUINT/parseUINT.js#L56)
