[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [evm](../README.md) / ExecResult

# Interface: ExecResult

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:282

Result of executing a call via the EVM.

## Properties

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:319

Amount of blob gas consumed by the transaction

***

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<`` `0x${string}` ``\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:311

Map of addresses which were created (used in EIP 6780)

***

### exceptionError?

> `optional` **exceptionError**: [`EvmError`](../classes/EvmError.md)

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:287

Description of the exception, if any occurred

***

### executionGasUsed

> **executionGasUsed**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:295

Amount of gas the code used to run

***

### gas?

> `optional` **gas**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:291

Amount of gas left

***

### gasRefund?

> `optional` **gasRefund**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:315

The gas refund counter

***

### logs?

> `optional` **logs**: [`EthjsLog`](../../utils/type-aliases/EthjsLog.md)[]

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:303

Array of logs that the contract emitted

***

### returnValue

> **returnValue**: `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:299

Return value from the contract

***

### runState?

> `optional` **runState**: `RunState`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:283

***

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<`` `0x${string}` ``\>

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:307

A set of accounts to selfdestruct
