**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [common](../README.md) / parseBlockNumber

# Function: parseBlockNumber()

> **parseBlockNumber**\<`TBlockNumber`\>(`blockNumber`): `TBlockNumber`

Parses a BlockNumber and returns the value if no errors.

## Type parameters

• **TBlockNumber** extends `number`

## Parameters

• **blockNumber**: `TBlockNumber`

## Returns

`TBlockNumber`

## Example

```ts
import { parseBlockNumber } from '@tevm/schemas';
const parsedBlockNumber = parseBlockNumber('0x1234567890abcdef1234567890abcdef12345678');
```

## Source

[experimental/schemas/src/common/SBlockNumber.js:109](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/common/SBlockNumber.js#L109)
