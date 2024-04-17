**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseInt256

# Function: parseInt256()

> **parseInt256**\<`TINT256`\>(`int256`): `TINT256`

Parses an INT256 and returns the value if no errors.

## Type parameters

• **TINT256** extends `bigint`

## Parameters

• **int256**: `TINT256`

## Returns

`TINT256`

## Example

```ts
import { parseInt256 } from '@tevm/schemas';
const parsedINT256 = parseInt256(420n);
```

## Source

[experimental/schemas/src/ethereum/SINT/parseINT.js:103](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/parseINT.js#L103)
