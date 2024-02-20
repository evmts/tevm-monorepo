---
editUrl: false
next: false
prev: false
title: "AbiConstructor"
---

> **AbiConstructor**: `object`

ABI ["constructor"](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

## Type declaration

### inputs

> **inputs**: readonly `AbiParameter`[]

### payable

> **payable**?: `boolean`

#### See

https://github.com/ethereum/solidity/issues/992

:::caution[Deprecated]
use `payable` or `nonpayable` from [AbiStateMutability]([object Object]) instead
:::

### stateMutability

> **stateMutability**: `Extract`\<`AbiStateMutability`, `"payable"` \| `"nonpayable"`\>

### type

> **type**: `"constructor"`

## Source

node\_modules/.pnpm/abitype@1.0.0\_typescript@5.3.3\_zod@3.22.4/node\_modules/abitype/dist/types/abi.d.ts:74

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
