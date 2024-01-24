**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > EthEstimateGasParams

# Type alias: EthEstimateGasParams`<TChain>`

> **EthEstimateGasParams**\<`TChain`\>: `Omit`\<`EstimateGasParameters`\<`TChain`\>, `"account"`\> & `object`

JSON-RPC request for `eth_estimateGas` procedure

## Type declaration

### to

> **to**: `Address`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TChain` extends `Chain` \| `undefined` | `Chain` \| `undefined` |

## Source

packages/actions-types/types/params/EthParams.d.ts:30

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
