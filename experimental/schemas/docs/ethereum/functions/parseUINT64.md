[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseUINT64

# Function: parseUINT64()

> **parseUINT64**\<`TUINT64`\>(`uint64`): `TUINT64`

Parses a UINT64 and returns the value if no errors.

## Type parameters

• **TUINT64** *extends* `bigint`

## Parameters

• **uint64**: `TUINT64`

## Returns

`TUINT64`

## Example

```ts
import { parseUINT64 } from '@tevm/schemas';
const parsedUINT64 = parseUINT64(BigInt("9223372036854775807"));
```

## Source

[experimental/schemas/src/ethereum/SUINT/parseUINT.js:70](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SUINT/parseUINT.js#L70)
