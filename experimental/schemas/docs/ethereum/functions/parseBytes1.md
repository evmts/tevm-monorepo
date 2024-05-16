[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes1

# Function: parseBytes1()

> **parseBytes1**\<`TBytes1`\>(`bytes1`): `TBytes1`

Parses a Bytes1 and returns the value if no errors.

## Type parameters

• **TBytes1** *extends* \`0x$\{string\}\`

## Parameters

• **bytes1**: `TBytes1`

## Returns

`TBytes1`

## Example

```ts
import { parseBytes1 } from '@tevm/schemas';
const parsedBytes1 = parseBytes1('0xff');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:54](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L54)
