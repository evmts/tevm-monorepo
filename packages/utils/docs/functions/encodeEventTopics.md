**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > encodeEventTopics

# Function: encodeEventTopics()

> **encodeEventTopics**\<`abi`, `eventName`\>(`parameters`): \`0x${string}\`[]

## Type parameters

▪ **abi** extends readonly `unknown`[] \| `Abi`

▪ **eventName** extends `undefined` \| `string` = `undefined`

## Parameters

▪ **parameters**: `EncodeEventTopicsParameters`\<`abi`, `eventName`, `abi` extends `Abi` ? `Abi` extends `abi`\<`abi`\> ? `true` : [`Extract`\<`abi`\<`abi`\>[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true`, `ContractEventArgs`\<`abi`, `eventName` extends `ContractEventName`\<`abi`\> ? `eventName`\<`eventName`\> : `ContractEventName`\<`abi`\>\>, `ContractEventName`\<`abi`\>\>

## Source

node\_modules/.pnpm/viem@2.9.23\_typescript@5.4.5\_zod@3.22.5/node\_modules/viem/\_types/utils/abi/encodeEventTopics.d.ts:24

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
