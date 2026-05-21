[**@tevm/evm**](../README.md)

***

[@tevm/evm](../globals.md) / EvmResult

# Interface: EvmResult

Result of executing a message via the EVM.

## Properties

### createdAddress?

> `optional` **createdAddress?**: `Address`

Address of created account during transaction, if any

***

### execResult

> **execResult**: [`ExecResult`](ExecResult.md)

Contains the results from running the code, if any, as described in runCode
