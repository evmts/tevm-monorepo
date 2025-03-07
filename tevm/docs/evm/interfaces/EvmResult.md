[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [evm](../README.md) / EvmResult

# Interface: EvmResult

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:269

Result of executing a message via the EVM.

## Extended by

- [`RunTxResult`](../../vm/interfaces/RunTxResult.md)

## Properties

### createdAddress?

> `optional` **createdAddress**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:273

Address of created account during transaction, if any

***

### execResult

> **execResult**: [`ExecResult`](ExecResult.md)

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:277

Contains the results from running the code, if any, as described in runCode
