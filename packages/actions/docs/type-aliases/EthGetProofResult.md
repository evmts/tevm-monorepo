[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthGetProofResult

# Type Alias: EthGetProofResult

> **EthGetProofResult** = `object`

Defined in: [packages/actions/src/eth/EthResult.ts:332](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L332)

JSON-RPC response for `eth_getProof` procedure (EIP-1186)
Returns the account and storage values of the specified account including the Merkle-proof.

## Properties

### accountProof

> **accountProof**: [`Hex`](Hex.md)[]

Defined in: [packages/actions/src/eth/EthResult.ts:340](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L340)

The account proof (array of RLP-serialized merkle trie nodes)

***

### address

> **address**: [`Address`](Address.md)

Defined in: [packages/actions/src/eth/EthResult.ts:336](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L336)

The address of the account

***

### balance

> **balance**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/eth/EthResult.ts:344](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L344)

The balance of the account

***

### codeHash

> **codeHash**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/eth/EthResult.ts:348](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L348)

The code hash of the account

***

### nonce

> **nonce**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/eth/EthResult.ts:352](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L352)

The nonce of the account

***

### storageHash

> **storageHash**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/eth/EthResult.ts:356](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L356)

The storage hash (root of the storage trie)

***

### storageProof

> **storageProof**: [`StorageProof`](StorageProof.md)[]

Defined in: [packages/actions/src/eth/EthResult.ts:360](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L360)

Array of storage proofs for the requested keys
