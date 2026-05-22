[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthGetProofResult

# Type Alias: EthGetProofResult

> **EthGetProofResult** = `object`

Defined in: [packages/actions/src/eth/EthResult.ts:332](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L332)

JSON-RPC response for `eth_getProof` procedure (EIP-1186)
Returns the account and storage values of the specified account including the Merkle-proof.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="accountproof"></a> `accountProof` | [`Hex`](Hex.md)[] | The account proof (array of RLP-serialized merkle trie nodes) | [packages/actions/src/eth/EthResult.ts:340](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L340) |
| <a id="address"></a> `address` | [`Address`](Address.md) | The address of the account | [packages/actions/src/eth/EthResult.ts:336](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L336) |
| <a id="balance"></a> `balance` | [`Hex`](Hex.md) | The balance of the account | [packages/actions/src/eth/EthResult.ts:344](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L344) |
| <a id="codehash"></a> `codeHash` | [`Hex`](Hex.md) | The code hash of the account | [packages/actions/src/eth/EthResult.ts:348](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L348) |
| <a id="nonce"></a> `nonce` | [`Hex`](Hex.md) | The nonce of the account | [packages/actions/src/eth/EthResult.ts:352](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L352) |
| <a id="storagehash"></a> `storageHash` | [`Hex`](Hex.md) | The storage hash (root of the storage trie) | [packages/actions/src/eth/EthResult.ts:356](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L356) |
| <a id="storageproof"></a> `storageProof` | [`StorageProof`](StorageProof.md)[] | Array of storage proofs for the requested keys | [packages/actions/src/eth/EthResult.ts:360](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L360) |
