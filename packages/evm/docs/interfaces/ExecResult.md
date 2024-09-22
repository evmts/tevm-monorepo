[**@tevm/evm**](../README.md) • **Docs**

***

[@tevm/evm](../globals.md) / ExecResult

# Interface: ExecResult

Result of executing a call via the EVM.

## Properties

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Amount of blob gas consumed by the transaction

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:319

***

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<\`0x$\{string\}\`\>

Map of addresses which were created (used in EIP 6780)

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:311

***

### exceptionError?

> `optional` **exceptionError**: [`EvmError`](../classes/EvmError.md)

Description of the exception, if any occurred

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:287

***

### executionGasUsed

> **executionGasUsed**: `bigint`

Amount of gas the code used to run

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:295

***

### gas?

> `optional` **gas**: `bigint`

Amount of gas left

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:291

***

### gasRefund?

> `optional` **gasRefund**: `bigint`

The gas refund counter

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:315

***

### logs?

> `optional` **logs**: `Log`[]

Array of logs that the contract emitted

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:303

***

### returnValue

> **returnValue**: `Uint8Array`

Return value from the contract

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:299

***

### runState?

> `optional` **runState**: `RunState`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:283

***

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<\`0x$\{string\}\`\>

A set of accounts to selfdestruct

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:307
