**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isINT256

# Function: isINT256()

> **isINT256**(`int256`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum INT256.

## Parameters

▪ **int256**: `unknown`

## Returns

## Example

```ts
import { isINT256 } from '@tevm/schemas';
isINT256(BigInt("-115792089237316195423570985008687907853269984665640564039457584007913129639936"));  // true
isINT256(BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935"));   // true
isINT256(BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639936"));   // false
isINT256(BigInt("-115792089237316195423570985008687907853269984665640564039457584007913129639937"));  // false
````

## Source

[packages/schemas/src/ethereum/SINT/isINT.js:109](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SINT/isINT.js#L109)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
