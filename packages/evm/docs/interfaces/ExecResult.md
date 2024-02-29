[@tevm/evm](../README.md) / [Exports](../modules.md) / ExecResult

# Interface: ExecResult

Result of executing a call via the EVM.

## Table of contents

### Properties

- [blobGasUsed](ExecResult.md#blobgasused)
- [createdAddresses](ExecResult.md#createdaddresses)
- [exceptionError](ExecResult.md#exceptionerror)
- [executionGasUsed](ExecResult.md#executiongasused)
- [gas](ExecResult.md#gas)
- [gasRefund](ExecResult.md#gasrefund)
- [logs](ExecResult.md#logs)
- [returnValue](ExecResult.md#returnvalue)
- [runState](ExecResult.md#runstate)
- [selfdestruct](ExecResult.md#selfdestruct)

## Properties

### blobGasUsed

• `Optional` **blobGasUsed**: `bigint`

Amount of blob gas consumed by the transaction

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.2.1/node_modules/@ethereumjs/evm/dist/esm/types.d.ts:291

___

### createdAddresses

• `Optional` **createdAddresses**: `Set`\<`string`\>

Map of addresses which were created (used in EIP 6780)

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.2.1/node_modules/@ethereumjs/evm/dist/esm/types.d.ts:283

___

### exceptionError

• `Optional` **exceptionError**: `EvmError`

Description of the exception, if any occurred

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.2.1/node_modules/@ethereumjs/evm/dist/esm/types.d.ts:259

___

### executionGasUsed

• **executionGasUsed**: `bigint`

Amount of gas the code used to run

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.2.1/node_modules/@ethereumjs/evm/dist/esm/types.d.ts:267

___

### gas

• `Optional` **gas**: `bigint`

Amount of gas left

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.2.1/node_modules/@ethereumjs/evm/dist/esm/types.d.ts:263

___

### gasRefund

• `Optional` **gasRefund**: `bigint`

The gas refund counter

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.2.1/node_modules/@ethereumjs/evm/dist/esm/types.d.ts:287

___

### logs

• `Optional` **logs**: [`EthjsLog`](../modules.md#ethjslog)[]

Array of logs that the contract emitted

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.2.1/node_modules/@ethereumjs/evm/dist/esm/types.d.ts:275

___

### returnValue

• **returnValue**: `Uint8Array`

Return value from the contract

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.2.1/node_modules/@ethereumjs/evm/dist/esm/types.d.ts:271

___

### runState

• `Optional` **runState**: `RunState`

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.2.1/node_modules/@ethereumjs/evm/dist/esm/types.d.ts:255

___

### selfdestruct

• `Optional` **selfdestruct**: `Set`\<`string`\>

A set of accounts to selfdestruct

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@2.2.1/node_modules/@ethereumjs/evm/dist/esm/types.d.ts:279
