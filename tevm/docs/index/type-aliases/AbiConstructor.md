[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / AbiConstructor

# Type Alias: AbiConstructor

> **AbiConstructor** = `object`

Defined in: tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:77

ABI ["constructor"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

## Properties

### inputs

> **inputs**: readonly `AbiParameter`[]

Defined in: tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:79

***

### ~~payable?~~

> `optional` **payable?**: `boolean`

Defined in: tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:84

#### Deprecated

use `payable` or `nonpayable` from AbiStateMutability instead

#### See

https://github.com/ethereum/solidity/issues/992

***

### stateMutability

> **stateMutability**: `Extract`\<`AbiStateMutability`, `"payable"` \| `"nonpayable"`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:85

***

### type

> **type**: `"constructor"`

Defined in: tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/abi.d.ts:78
