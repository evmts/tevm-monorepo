[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / AbiConstructor

# Type Alias: AbiConstructor

> **AbiConstructor**: `object`

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.2\_zod@3.24.2/node\_modules/abitype/dist/types/abi.d.ts:77

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
