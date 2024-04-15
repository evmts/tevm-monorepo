**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ContractFunctionName

# Type alias: ContractFunctionName`<abi, mutability>`

> **ContractFunctionName**\<`abi`, `mutability`\>: `ExtractAbiFunctionNames`\<`abi` extends `Abi` ? `abi` : `Abi`, `mutability`\> extends infer functionName ? [`functionName`] extends [`never`] ? `string` : `functionName` : `string`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `abi` extends `Abi` \| readonly `unknown`[] | `Abi` |
| `mutability` extends `AbiStateMutability` | `AbiStateMutability` |

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5\_zod@3.22.4/node\_modules/viem/\_types/types/contract.d.ts:5

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
