[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthGetProofParams

# Type Alias: EthGetProofParams

> **EthGetProofParams** = `object`

Based on the JSON-RPC request for `eth_getProof` procedure (EIP-1186)

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="address"></a> `address` | `readonly` | [`Address`](Address.md) | The address of the account to get the proof for |
| <a id="blocktag"></a> `blockTag?` | `readonly` | [`BlockParam`](../../index/type-aliases/BlockParam.md) | The block tag or block number to get the proof at |
| <a id="storagekeys"></a> `storageKeys` | `readonly` | readonly [`Hex`](Hex.md)[] | An array of storage keys to get proofs for |
