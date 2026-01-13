[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / JsonRpcContractCreationEvent

# Type Alias: JsonRpcContractCreationEvent

> **JsonRpcContractCreationEvent** = `object`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:491](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L491)

JSON-RPC contract creation event for eth_simulateV2

## Properties

### address

> **address**: `Address`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:493](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L493)

The address of the newly created contract

***

### code

> **code**: `Hex`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:497](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L497)

The code deployed to the contract

***

### creator

> **creator**: `Address`

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:495](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L495)

The address of the creator
