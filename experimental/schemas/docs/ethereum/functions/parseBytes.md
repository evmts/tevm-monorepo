[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes

# Function: parseBytes()

> **parseBytes**\<`TBytes`\>(`hex`): `TBytes`

Parses a Bytes and returns the value if no errors.

## Type parameters

• **TBytes** *extends* \`0x$\{string\}\`

## Parameters

• **hex**: `TBytes`

## Returns

`TBytes`

## Example

```javascript
import { parseBytes } from '@tevm/schemas';
const parsedBytes = parseBytes('0x1234567890abcdef1234567890abcdef12345678');
```

## Source

[experimental/schemas/src/ethereum/SBytes/parseBytes.js:20](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytes/parseBytes.js#L20)
