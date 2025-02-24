[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseInt16

# Function: parseInt16()

> **parseInt16**\<`TINT16`\>(`int16`): `TINT16`

Parses an INT16 and returns the value if no errors.

## Type Parameters

• **TINT16** *extends* `bigint`

## Parameters

• **int16**: `TINT16`

## Returns

`TINT16`

## Example

```ts
import { parseInt16 } from '@tevm/schemas';
const parsedINT16 = parseInt16(BigInt(-32768));
```

## Defined in

[experimental/schemas/src/ethereum/SINT/parseINT.js:43](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/parseINT.js#L43)
