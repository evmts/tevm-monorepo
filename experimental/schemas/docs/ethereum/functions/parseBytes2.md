[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes2

# Function: parseBytes2()

> **parseBytes2**\<`TBytes2`\>(`bytes2`): `TBytes2`

Parses a Bytes2 and returns the value if no errors.

## Type parameters

• **TBytes2** *extends* \`0x$\{string\}\`

## Parameters

• **bytes2**: `TBytes2`

## Returns

`TBytes2`

## Example

```ts
import { parseBytes2 } from '@tevm/schemas';
const parsedBytes2 = parseBytes2('0xffaa');
```

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:69](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L69)
