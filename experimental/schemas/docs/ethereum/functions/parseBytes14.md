[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes14

# Function: parseBytes14()

> **parseBytes14**\<`TBytes14`\>(`bytes14`): `TBytes14`

Parses a Bytes14 and returns the value if no errors.

## Type Parameters

• **TBytes14** *extends* \`0x$\{string\}\`

## Parameters

• **bytes14**: `TBytes14`

## Returns

`TBytes14`

## Example

```ts
import { parseBytes14 } from '@tevm/schemas';
const parsedBytes14 = parseBytes14('0xffaabbccddeeffaabbccddaaeeffaa');
```

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js:247](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixed.js#L247)
