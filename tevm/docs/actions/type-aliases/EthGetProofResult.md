[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthGetProofResult

# Type Alias: EthGetProofResult

> **EthGetProofResult** = `object`

JSON-RPC response for `eth_getProof` procedure (EIP-1186)
Returns the account and storage values of the specified account including the Merkle-proof.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="accountproof"></a> `accountProof` | [`Hex`](Hex.md)[] | The account proof (array of RLP-serialized merkle trie nodes) |
| <a id="address"></a> `address` | [`Address`](Address.md) | The address of the account |
| <a id="balance"></a> `balance` | [`Hex`](Hex.md) | The balance of the account |
| <a id="codehash"></a> `codeHash` | [`Hex`](Hex.md) | The code hash of the account |
| <a id="nonce"></a> `nonce` | [`Hex`](Hex.md) | The nonce of the account |
| <a id="storagehash"></a> `storageHash` | [`Hex`](Hex.md) | The storage hash (root of the storage trie) |
| <a id="storageproof"></a> `storageProof` | [`StorageProof`](StorageProof.md)[] | Array of storage proofs for the requested keys |
