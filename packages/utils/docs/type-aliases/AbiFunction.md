[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / AbiFunction

# Type Alias: AbiFunction

> **AbiFunction**: `object`

ABI ["function"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

## Type declaration

### ~~constant?~~

> `optional` **constant**: `boolean`

#### Deprecated

use `pure` or `view` from AbiStateMutability instead

#### See

https://github.com/ethereum/solidity/issues/992

### ~~gas?~~

> `optional` **gas**: `number`

#### Deprecated

Vyper used to provide gas estimates

#### See

https://github.com/vyperlang/vyper/issues/2151

### inputs

> **inputs**: readonly `AbiParameter`[]

### name

> **name**: `string`

### outputs

> **outputs**: readonly `AbiParameter`[]

### ~~payable?~~

> `optional` **payable**: `boolean`

#### Deprecated

use `payable` or `nonpayable` from AbiStateMutability instead

#### See

https://github.com/ethereum/solidity/issues/992

### stateMutability

> **stateMutability**: `AbiStateMutability`

### type

> **type**: `"function"`

## Defined in

node\_modules/.pnpm/abitype@1.0.4\_typescript@5.5.3\_zod@3.23.8/node\_modules/abitype/dist/types/abi.d.ts:54
