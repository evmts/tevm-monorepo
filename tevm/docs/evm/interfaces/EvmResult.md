[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [evm](../README.md) / EvmResult

# Interface: EvmResult

Result of executing a message via the EVM.

## Extended by

- [`RunTxResult`](../../vm/interfaces/RunTxResult.md)

## Properties

### createdAddress?

> `optional` **createdAddress**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Address of created account during transaction, if any

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:273

***

### execResult

> **execResult**: [`ExecResult`](ExecResult.md)

Contains the results from running the code, if any, as described in runCode

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:277
