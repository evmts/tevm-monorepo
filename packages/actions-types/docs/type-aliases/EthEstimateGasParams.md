**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > EthEstimateGasParams

# Type alias: EthEstimateGasParams`<TChain>`

> **EthEstimateGasParams**\<`TChain`\>: `Omit`\<`EstimateGasParameters`\<`TChain`\>, `"account"`\> & `object`

Based on the JSON-RPC request for `eth_estimateGas` procedure

## Type declaration

### to

> **to**: `Address`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TChain` extends `Chain` \| `undefined` | `Chain` \| `undefined` |

## Source

[params/EthParams.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/EthParams.ts#L77)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
