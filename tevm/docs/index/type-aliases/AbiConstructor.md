[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / AbiConstructor

# Type Alias: AbiConstructor

> **AbiConstructor** = `object`

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.24.4/node\_modules/abitype/dist/types/abi.d.ts:77

ABI ["constructor"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

## Properties

### inputs

> **inputs**: readonly `AbiParameter`[]

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.24.4/node\_modules/abitype/dist/types/abi.d.ts:79

***

### ~~payable?~~

> `optional` **payable**: `boolean`

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.24.4/node\_modules/abitype/dist/types/abi.d.ts:84

#### Deprecated

use `payable` or `nonpayable` from AbiStateMutability instead

#### See

https://github.com/ethereum/solidity/issues/992

***

### stateMutability

> **stateMutability**: `Extract`\<`AbiStateMutability`, `"payable"` \| `"nonpayable"`\>

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.24.4/node\_modules/abitype/dist/types/abi.d.ts:85

***

### type

> **type**: `"constructor"`

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.24.4/node\_modules/abitype/dist/types/abi.d.ts:78
