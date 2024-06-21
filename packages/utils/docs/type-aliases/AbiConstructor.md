[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / AbiConstructor

# Type alias: AbiConstructor

> **AbiConstructor**: `object`

ABI ["constructor"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

## Type declaration

### inputs

> **inputs**: readonly `AbiParameter`[]

### ~~payable?~~

> `optional` **payable**: `boolean`

#### Deprecated

use `payable` or `nonpayable` from AbiStateMutability instead

#### See

https://github.com/ethereum/solidity/issues/992

### stateMutability

> **stateMutability**: `Extract`\<`AbiStateMutability`, `"payable"` \| `"nonpayable"`\>

### type

> **type**: `"constructor"`

## Source

node\_modules/.pnpm/abitype@1.0.2\_typescript@5.5.2\_zod@3.23.8/node\_modules/abitype/dist/types/abi.d.ts:74
