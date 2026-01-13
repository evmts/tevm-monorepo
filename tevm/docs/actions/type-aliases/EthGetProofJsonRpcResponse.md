[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthGetProofJsonRpcResponse

# Type Alias: EthGetProofJsonRpcResponse

> **EthGetProofJsonRpcResponse** = [`JsonRpcResponse`](../../index/type-aliases/JsonRpcResponse.md)\<`"eth_getProof"`, \{ `accountProof`: [`Hex`](../../index/type-aliases/Hex.md)[]; `address`: [`Address`](../../index/type-aliases/Address.md); `balance`: [`Hex`](../../index/type-aliases/Hex.md); `codeHash`: [`Hex`](../../index/type-aliases/Hex.md); `nonce`: [`Hex`](../../index/type-aliases/Hex.md); `storageHash`: [`Hex`](../../index/type-aliases/Hex.md); `storageProof`: `object`[]; \}, `string` \| `number`\>

Defined in: packages/actions/types/eth/EthJsonRpcResponse.d.ts:234

JSON-RPC response for `eth_getProof` procedure (EIP-1186)
