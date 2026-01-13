[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthGetProofResult

# Type Alias: EthGetProofResult

> **EthGetProofResult** = `object`

Defined in: packages/actions/types/eth/EthResult.d.ts:240

JSON-RPC response for `eth_getProof` procedure (EIP-1186)
Returns the account and storage values of the specified account including the Merkle-proof.

## Properties

### accountProof

> **accountProof**: [`Hex`](Hex.md)[]

Defined in: packages/actions/types/eth/EthResult.d.ts:248

The account proof (array of RLP-serialized merkle trie nodes)

***

### address

> **address**: [`Address`](Address.md)

Defined in: packages/actions/types/eth/EthResult.d.ts:244

The address of the account

***

### balance

> **balance**: [`Hex`](Hex.md)

Defined in: packages/actions/types/eth/EthResult.d.ts:252

The balance of the account

***

### codeHash

> **codeHash**: [`Hex`](Hex.md)

Defined in: packages/actions/types/eth/EthResult.d.ts:256

The code hash of the account

***

### nonce

> **nonce**: [`Hex`](Hex.md)

Defined in: packages/actions/types/eth/EthResult.d.ts:260

The nonce of the account

***

### storageHash

> **storageHash**: [`Hex`](Hex.md)

Defined in: packages/actions/types/eth/EthResult.d.ts:264

The storage hash (root of the storage trie)

***

### storageProof

> **storageProof**: [`StorageProof`](StorageProof.md)[]

Defined in: packages/actions/types/eth/EthResult.d.ts:268

Array of storage proofs for the requested keys
