[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [common](../README.md) / parseBlockNumber

# Function: parseBlockNumber()

> **parseBlockNumber**\<`TBlockNumber`\>(`blockNumber`): `TBlockNumber`

Parses a BlockNumber and returns the value if no errors.

## Type Parameters

• **TBlockNumber** *extends* `number`

## Parameters

• **blockNumber**: `TBlockNumber`

## Returns

`TBlockNumber`

## Example

```ts
import { parseBlockNumber } from '@tevm/schemas';
const parsedBlockNumber = parseBlockNumber('0x1234567890abcdef1234567890abcdef12345678');
```

## Defined in

[experimental/schemas/src/common/SBlockNumber.js:106](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/common/SBlockNumber.js#L106)
