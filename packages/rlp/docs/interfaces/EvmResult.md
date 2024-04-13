[@tevm/evm](../README.md) / [Exports](../modules.md) / EvmResult

# Interface: EvmResult

Result of executing a message via the EVM.

## Table of contents

### Properties

- [createdAddress](EvmResult.md#createdaddress)
- [execResult](EvmResult.md#execresult)

## Properties

### createdAddress

• `Optional` **createdAddress**: `Address`

Address of created account during transaction, if any

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/types.d.ts:248

___

### execResult

• **execResult**: [`ExecResult`](ExecResult.md)

Contains the results from running the code, if any, as described in runCode

#### Defined in

node_modules/.pnpm/@ethereumjs+evm@3.0.0/node_modules/@ethereumjs/evm/dist/esm/types.d.ts:252
