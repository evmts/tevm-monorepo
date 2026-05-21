[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [evm](../README.md) / ExecResult

# Interface: ExecResult

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:340

Result of executing a call via the EVM.

## Properties

### blobGasUsed?

> `optional` **blobGasUsed?**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:377

Amount of blob gas consumed by the transaction

***

### createdAddresses?

> `optional` **createdAddresses?**: `Set`\<`` `0x${string}` ``\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:369

Map of addresses which were created (used in EIP 6780)

***

### exceptionError?

> `optional` **exceptionError?**: [`EVMError`](../classes/EVMError.md)

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:345

Description of the exception, if any occurred

***

### executionGasUsed

> **executionGasUsed**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:353

Amount of gas the code used to run

***

### gas?

> `optional` **gas?**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:349

Amount of gas left

***

### gasRefund?

> `optional` **gasRefund?**: `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:373

The gas refund counter

***

### logs?

> `optional` **logs?**: [`Log`](../type-aliases/Log.md)[]

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:361

Array of logs that the contract emitted

***

### returnValue

> **returnValue**: `Uint8Array`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:357

Return value from the contract

***

### runState?

> `optional` **runState?**: `RunState`

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:341

***

### selfdestruct?

> `optional` **selfdestruct?**: `Set`\<`` `0x${string}` ``\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:365

A set of accounts to selfdestruct
