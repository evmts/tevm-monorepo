**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseInt8

# Function: parseInt8()

> **parseInt8**\<`TINT8`\>(`int8`): `TINT8`

Parses an INT8 and returns the value if no errors.

## Type parameters

• **TINT8** extends `bigint`

extends INT8

## Parameters

• **int8**: `TINT8`

## Returns

`TINT8`

## Example

```ts
import { parseInt8 } from '@tevm/schemas';
const parsedINT8 = parseInt8(BigInt(-128));
```

## Source

[experimental/schemas/src/ethereum/SINT/parseINT.js:28](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/parseINT.js#L28)
