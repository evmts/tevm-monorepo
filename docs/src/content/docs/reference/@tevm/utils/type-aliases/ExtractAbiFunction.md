---
editUrl: false
next: false
prev: false
title: "ExtractAbiFunction"
---

> **ExtractAbiFunction**\<`TAbi`, `TFunctionName`, `TAbiStateMutability`\>: `Extract`\<`ExtractAbiFunctions`\<`TAbi`, `TAbiStateMutability`\>, `object`\>

Extracts [AbiFunction](../../../../../../../reference/tevm/utils/type-aliases/abifunction) with name from [Abi](../../../../../../../reference/tevm/utils/type-aliases/abi).

## Type parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/)

[Abi](../../../../../../../reference/tevm/utils/type-aliases/abi) to extract [AbiFunction](../../../../../../../reference/tevm/utils/type-aliases/abifunction) from

• **TFunctionName** *extends* [`ExtractAbiFunctionNames`](/reference/tevm/utils/type-aliases/extractabifunctionnames/)\<`TAbi`\>

String name of function to extract from [Abi](../../../../../../../reference/tevm/utils/type-aliases/abi)

• **TAbiStateMutability** *extends* `AbiStateMutability` = `AbiStateMutability`

AbiStateMutability to filter by

## Source

node\_modules/.pnpm/abitype@1.0.2\_typescript@5.4.5\_zod@3.23.8/node\_modules/abitype/dist/types/utils.d.ts:123
