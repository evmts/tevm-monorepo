---
editUrl: false
next: false
prev: false
title: "AbiFunction"
---

> **AbiFunction**: `object`

ABI ["function"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

## Type declaration

### ~~constant?~~

> `optional` **constant**: `boolean`

#### See

https://github.com/ethereum/solidity/issues/992

:::caution[Deprecated]
use `pure` or `view` from AbiStateMutability instead
:::

### ~~gas?~~

> `optional` **gas**: `number`

#### See

https://github.com/vyperlang/vyper/issues/2151

:::caution[Deprecated]
Vyper used to provide gas estimates
:::

### inputs

> **inputs**: readonly `AbiParameter`[]

### name

> **name**: `string`

### outputs

> **outputs**: readonly `AbiParameter`[]

### ~~payable?~~

> `optional` **payable**: `boolean`

#### See

https://github.com/ethereum/solidity/issues/992

:::caution[Deprecated]
use `payable` or `nonpayable` from AbiStateMutability instead
:::

### stateMutability

> **stateMutability**: `AbiStateMutability`

### type

> **type**: `"function"`

## Defined in

node\_modules/.pnpm/abitype@1.0.4\_typescript@5.5.4\_zod@3.23.8/node\_modules/abitype/dist/types/abi.d.ts:54
