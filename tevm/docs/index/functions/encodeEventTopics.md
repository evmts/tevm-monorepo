[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / encodeEventTopics

# Function: encodeEventTopics()

> **encodeEventTopics**\<`abi`, `eventName`\>(`parameters`): `EncodeEventTopicsReturnType`

## Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[]

• **eventName** *extends* `undefined` \| `string` = `undefined`

## Parameters

• **parameters**: [`EncodeEventTopicsParameters`](../../utils/type-aliases/EncodeEventTopicsParameters.md)\<`abi`, `eventName`, `abi` *extends* `Abi` ? `Abi` *extends* `abi`\<`abi`\> ? `true` : [`Extract`\<`abi`\<`abi`\>\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`, `ContractEventArgs`\<`abi`, `eventName` *extends* `ContractEventName`\<`abi`\> ? `eventName`\<`eventName`\> : `ContractEventName`\<`abi`\>\>, `ContractEventName`\<`abi`\>\>

## Returns

`EncodeEventTopicsReturnType`

## Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.7.3\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/abi/encodeEventTopics.d.ts:26
