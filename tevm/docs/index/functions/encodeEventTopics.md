**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > encodeEventTopics

# Function: encodeEventTopics()

> **encodeEventTopics**\<`abi`, `eventName`\>(`parameters`): \`0x${string}\`[]

## Type parameters

▪ **abi** extends `Abi` \| readonly `unknown`[]

▪ **eventName** extends `undefined` \| `string` = `undefined`

## Parameters

▪ **parameters**: `EncodeEventTopicsParameters`\<`abi`, `eventName`, `abi` extends `Abi` ? `Abi` extends `abi` ? `true` : [`Extract`\<`abi`[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true`, `ContractEventArgs`\<`abi`, `eventName` extends `ContractEventName`\<`abi`\> ? `eventName` : `ContractEventName`\<`abi`\>\>, `ContractEventName`\<`abi`\>\>

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/abi/encodeEventTopics.d.ts:24

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
