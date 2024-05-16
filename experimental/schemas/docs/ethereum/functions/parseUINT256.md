[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseUINT256

# Function: parseUINT256()

> **parseUINT256**\<`TUINT256`\>(`uint256`): `TUINT256`

Parses a UINT256 and returns the value if no errors.

## Type parameters

• **TUINT256** *extends* `bigint`

## Parameters

• **uint256**: `TUINT256`

## Returns

`TUINT256`

## Example

```ts
import { parseUINT256 } from '@tevm/schemas';
const parsedUINT256 = parseUINT256('0x1234567890abcdef1234567890abcdef12345678');
```

## Source

[experimental/schemas/src/ethereum/SUINT/parseUINT.js:98](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SUINT/parseUINT.js#L98)
