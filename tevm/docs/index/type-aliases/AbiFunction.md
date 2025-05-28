[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / AbiFunction

# Type Alias: AbiFunction

> **AbiFunction** = `object`

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.25.30/node\_modules/abitype/dist/types/abi.d.ts:54

ABI ["function"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

## Properties

### ~~constant?~~

> `optional` **constant**: `boolean`

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.25.30/node\_modules/abitype/dist/types/abi.d.ts:60

#### Deprecated

use `pure` or `view` from AbiStateMutability instead

#### See

https://github.com/ethereum/solidity/issues/992

***

### ~~gas?~~

> `optional` **gas**: `number`

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.25.30/node\_modules/abitype/dist/types/abi.d.ts:65

#### Deprecated

Vyper used to provide gas estimates

#### See

https://github.com/vyperlang/vyper/issues/2151

***

### inputs

> **inputs**: readonly `AbiParameter`[]

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.25.30/node\_modules/abitype/dist/types/abi.d.ts:66

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.25.30/node\_modules/abitype/dist/types/abi.d.ts:67

***

### outputs

> **outputs**: readonly `AbiParameter`[]

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.25.30/node\_modules/abitype/dist/types/abi.d.ts:68

***

### ~~payable?~~

> `optional` **payable**: `boolean`

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.25.30/node\_modules/abitype/dist/types/abi.d.ts:73

#### Deprecated

use `payable` or `nonpayable` from AbiStateMutability instead

#### See

https://github.com/ethereum/solidity/issues/992

***

### stateMutability

> **stateMutability**: `AbiStateMutability`

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.25.30/node\_modules/abitype/dist/types/abi.d.ts:74

***

### type

> **type**: `"function"`

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.25.30/node\_modules/abitype/dist/types/abi.d.ts:55
