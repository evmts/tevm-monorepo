[**@tevm/evm**](../README.md)

***

[@tevm/evm](../globals.md) / ExecResult

# Interface: ExecResult

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:342

Result of executing a call via the EVM.

## Properties

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:379

Amount of blob gas consumed by the transaction

***

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<`` `0x${string}` ``\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:371

Map of addresses which were created (used in EIP 6780)

***

### exceptionError?

> `optional` **exceptionError**: [`EvmError`](../classes/EvmError.md)

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:347

Description of the exception, if any occurred

***

### executionGasUsed

> **executionGasUsed**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:355

Amount of gas the code used to run

***

### gas?

> `optional` **gas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:351

Amount of gas left

***

### gasRefund?

> `optional` **gasRefund**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:375

The gas refund counter

***

### logs?

> `optional` **logs**: [`Log`](../type-aliases/Log.md)[]

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:363

Array of logs that the contract emitted

***

### returnValue

> **returnValue**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:359

Return value from the contract

***

### runState?

> `optional` **runState**: `RunState`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:343

***

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<`` `0x${string}` ``\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:367

A set of accounts to selfdestruct
