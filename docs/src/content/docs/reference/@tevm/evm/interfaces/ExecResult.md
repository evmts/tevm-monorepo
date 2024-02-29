---
editUrl: false
next: false
prev: false
title: "ExecResult"
---

Result of executing a call via the EVM.

## Properties

### blobGasUsed

> **blobGasUsed**?: `bigint`

Amount of blob gas consumed by the transaction

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.2.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:291

***

### createdAddresses

> **createdAddresses**?: `Set`\<`string`\>

Map of addresses which were created (used in EIP 6780)

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.2.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:283

***

### exceptionError

> **exceptionError**?: `EvmError`

Description of the exception, if any occurred

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.2.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:259

***

### executionGasUsed

> **executionGasUsed**: `bigint`

Amount of gas the code used to run

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.2.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:267

***

### gas

> **gas**?: `bigint`

Amount of gas left

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.2.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:263

***

### gasRefund

> **gasRefund**?: `bigint`

The gas refund counter

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.2.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:287

***

### logs

> **logs**?: [`EthjsLog`](/reference/tevm/evm/type-aliases/ethjslog/)[]

Array of logs that the contract emitted

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.2.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:275

***

### returnValue

> **returnValue**: `Uint8Array`

Return value from the contract

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.2.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:271

***

### runState

> **runState**?: `RunState`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.2.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:255

***

### selfdestruct

> **selfdestruct**?: `Set`\<`string`\>

A set of accounts to selfdestruct

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.2.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:279

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
