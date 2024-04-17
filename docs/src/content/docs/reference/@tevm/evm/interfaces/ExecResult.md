---
editUrl: false
next: false
prev: false
title: "ExecResult"
---

Result of executing a call via the EVM.

## Properties

### blobGasUsed?

> **`optional`** **blobGasUsed**: `bigint`

Amount of blob gas consumed by the transaction

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:294

***

### createdAddresses?

> **`optional`** **createdAddresses**: `Set`\<`string`\>

Map of addresses which were created (used in EIP 6780)

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:286

***

### exceptionError?

> **`optional`** **exceptionError**: [`EvmError`](/reference/classes/evmerror/)

Description of the exception, if any occurred

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:262

***

### executionGasUsed

> **executionGasUsed**: `bigint`

Amount of gas the code used to run

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:270

***

### gas?

> **`optional`** **gas**: `bigint`

Amount of gas left

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:266

***

### gasRefund?

> **`optional`** **gasRefund**: `bigint`

The gas refund counter

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:290

***

### logs?

> **`optional`** **logs**: [`EthjsLog`](/reference/utils/type-aliases/ethjslog/)[]

Array of logs that the contract emitted

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:278

***

### returnValue

> **returnValue**: `Uint8Array`

Return value from the contract

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:274

***

### runState?

> **`optional`** **runState**: `RunState`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:258

***

### selfdestruct?

> **`optional`** **selfdestruct**: `Set`\<`string`\>

A set of accounts to selfdestruct

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:282
