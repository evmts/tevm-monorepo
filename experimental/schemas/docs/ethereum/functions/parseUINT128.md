**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseUINT128

# Function: parseUINT128()

> **parseUINT128**\<`TUINT128`\>(`uint128`): `TUINT128`

Parses a UINT128 and returns the value if no errors.

## Type parameters

• **TUINT128** extends `bigint`

## Parameters

• **uint128**: `TUINT128`

## Returns

`TUINT128`

## Example

```ts
import { parseUINT128 } from '@tevm/schemas';
const parsedUINT128 = parseUINT128(BigInt("170141183460469231731687303715884105727"));
```

## Source

[experimental/schemas/src/ethereum/SUINT/parseUINT.js:84](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SUINT/parseUINT.js#L84)
