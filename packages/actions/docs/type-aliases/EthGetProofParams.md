[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthGetProofParams

# Type Alias: EthGetProofParams

> **EthGetProofParams** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:344](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L344)

Based on the JSON-RPC request for `eth_getProof` procedure (EIP-1186)

## Properties

### address

> `readonly` **address**: [`Address`](Address.md)

Defined in: [packages/actions/src/eth/EthParams.ts:348](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L348)

The address of the account to get the proof for

***

### blockTag?

> `readonly` `optional` **blockTag**: [`BlockParam`](BlockParam.md)

Defined in: [packages/actions/src/eth/EthParams.ts:356](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L356)

The block tag or block number to get the proof at

***

### storageKeys

> `readonly` **storageKeys**: readonly [`Hex`](Hex.md)[]

Defined in: [packages/actions/src/eth/EthParams.ts:352](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L352)

An array of storage keys to get proofs for
