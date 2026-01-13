[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthGetProofJsonRpcResponse

# Type Alias: EthGetProofJsonRpcResponse

> **EthGetProofJsonRpcResponse** = `JsonRpcResponse`\<`"eth_getProof"`, \{ `accountProof`: `Hex`[]; `address`: `Address`; `balance`: `Hex`; `codeHash`: `Hex`; `nonce`: `Hex`; `storageHash`: `Hex`; `storageProof`: `object`[]; \}, `string` \| `number`\>

Defined in: [packages/actions/src/eth/EthJsonRpcResponse.ts:412](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthJsonRpcResponse.ts#L412)

JSON-RPC response for `eth_getProof` procedure (EIP-1186)
