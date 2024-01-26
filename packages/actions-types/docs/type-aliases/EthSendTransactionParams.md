**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > EthSendTransactionParams

# Type alias: EthSendTransactionParams`<TChain>`

> **EthSendTransactionParams**\<`TChain`\>: `Omit`\<`SendTransactionParameters`\<`TChain`\>, `"account"`\> & `object`

Based on the JSON-RPC request for `eth_sendTransaction` procedure

## Type declaration

### from

> **from**: `Address`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TChain` extends `Chain` \| `undefined` | `Chain` \| `undefined` |

## Source

[params/EthParams.ts:231](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L231)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
