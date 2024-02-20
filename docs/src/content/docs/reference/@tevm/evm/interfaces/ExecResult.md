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

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:289

***

### createdAddresses

> **createdAddresses**?: `Set`\<`string`\>

Map of addresses which were created (used in EIP 6780)

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:281

***

### exceptionError

> **exceptionError**?: `EvmError`

Description of the exception, if any occurred

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:257

***

### executionGasUsed

> **executionGasUsed**: `bigint`

Amount of gas the code used to run

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:265

***

### gas

> **gas**?: `bigint`

Amount of gas left

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:261

***

### gasRefund

> **gasRefund**?: `bigint`

The gas refund counter

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:285

***

### logs

> **logs**?: [`EthjsLog`](/reference/tevm/evm/type-aliases/ethjslog/)[]

Array of logs that the contract emitted

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:273

***

### returnValue

> **returnValue**: `Uint8Array`

Return value from the contract

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:269

***

### runState

> **runState**?: `RunState`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:253

***

### selfdestruct

> **selfdestruct**?: `Set`\<`string`\>

A set of accounts to selfdestruct

#### Source

node\_modules/.pnpm/@ethereumjs+evm@2.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:277

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
