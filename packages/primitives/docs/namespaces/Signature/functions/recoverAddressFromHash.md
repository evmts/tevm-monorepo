[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [Signature](../README.md) / recoverAddressFromHash

# Function: recoverAddressFromHash()

> **recoverAddressFromHash**(`_signature`, `_messageHash`): `Effect`\<[`Address`](../../Address/type-aliases/Address.md), `Error`\>

Defined in: [Signature.ts:190](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/Signature.ts#L190)

Recovers the signer's address from a signature and message hash
(Note: Currently a placeholder as we need viem account interface)

## Parameters

### \_signature

[`Signature`](../interfaces/Signature.md)

### \_messageHash

[`B256`](../../B256/type-aliases/B256.md)

## Returns

`Effect`\<[`Address`](../../Address/type-aliases/Address.md), `Error`\>
