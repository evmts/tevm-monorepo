[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes

# Function: isBytes()

> **isBytes**(`value`): `boolean`

Type guard that returns true if a string is a valid hex string.

## Parameters

• **value**: `string`

The string to check.

## Returns

`boolean`

- True if the string is a valid hex string.

## Example

```javascript
import { isBytes } from '@tevm/schemas';
const hex = '0x1234567890abcdef1234567890abcdef12345678';
const isHex = isBytes(hex);
```

## Defined in

[experimental/schemas/src/ethereum/SBytes/isBytes.js:22](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytes/isBytes.js#L22)
