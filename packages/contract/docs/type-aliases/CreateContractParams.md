**@tevm/contract** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > CreateContractParams

# Type alias: CreateContractParams`<TName, THumanReadableAbi>`

> **CreateContractParams**\<`TName`, `THumanReadableAbi`\>: `Pick`\<[`Contract`](Contract.md)\<`TName`, `THumanReadableAbi`\>, `"name"` \| `"humanReadableAbi"`\>

Params for creating a [Contract](Contract.md) instance

## See

[CreateContract](CreateContract.md)

## Type parameters

| Parameter |
| :------ |
| `TName` extends `string` |
| `THumanReadableAbi` extends readonly `string`[] |

## Source

[core/contract/src/types.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/core/contract/src/types.ts#L8)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
