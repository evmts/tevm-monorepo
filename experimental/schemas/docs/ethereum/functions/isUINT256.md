[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isUINT256

# Function: isUINT256()

> **isUINT256**(`uint256`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum UINT256.

## Parameters

• **uint256**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isUINT256 } from '@tevm/schemas';
isUINT256(BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935"));  // true
isUINT256(BigInt("231584178474632390847141970017375815706539969331281128078915168015826259279872"));  // false
````

## Source

[experimental/schemas/src/ethereum/SUINT/isUINT.js:92](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SUINT/isUINT.js#L92)
