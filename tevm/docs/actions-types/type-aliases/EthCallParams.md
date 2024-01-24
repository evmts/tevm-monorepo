**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > EthCallParams

# Type alias: EthCallParams`<TChain>`

> **EthCallParams**\<`TChain`\>: `Omit`\<`CallParameters`\<`TChain`\>, `"account"`\> & `object`

JSON-RPC request for `eth_call` procedure

## Type declaration

### to

> **to**: `Address`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TChain` extends `Chain` \| `undefined` | `Chain` \| `undefined` |

## Source

packages/actions-types/types/params/EthParams.d.ts:16

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
