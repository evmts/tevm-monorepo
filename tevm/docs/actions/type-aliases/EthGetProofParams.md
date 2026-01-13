[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthGetProofParams

# Type Alias: EthGetProofParams

> **EthGetProofParams** = `object`

Defined in: packages/actions/types/eth/EthParams.d.ts:323

Based on the JSON-RPC request for `eth_getProof` procedure (EIP-1186)

## Properties

### address

> `readonly` **address**: [`Address`](Address.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:327

The address of the account to get the proof for

***

### blockTag?

> `readonly` `optional` **blockTag**: [`BlockParam`](../../index/type-aliases/BlockParam.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:335

The block tag or block number to get the proof at

***

### storageKeys

> `readonly` **storageKeys**: readonly [`Hex`](Hex.md)[]

Defined in: packages/actions/types/eth/EthParams.d.ts:331

An array of storage keys to get proofs for
