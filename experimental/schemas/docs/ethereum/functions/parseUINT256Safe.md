**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseUINT256Safe

# Function: parseUINT256Safe()

> **parseUINT256Safe**\<`TUINT256`\>(`uint256`): `Effect`\<`never`, [`InvalidUINTError`](../classes/InvalidUINTError.md), `TUINT256`\>

Safely parses a UINT256 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

• **TUINT256** extends `bigint`

## Parameters

• **uint256**: `TUINT256`

## Returns

`Effect`\<`never`, [`InvalidUINTError`](../classes/InvalidUINTError.md), `TUINT256`\>

## Example

```ts
import { parseUINT256Safe } from '@tevm/schemas';
const parsedUINT256Effect = parseUINT256Safe('0x1234567890abcdef1234567890abcdef12345678');
```

## Source

[experimental/schemas/src/ethereum/SUINT/parseUINTSafe.js:148](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SUINT/parseUINTSafe.js#L148)
