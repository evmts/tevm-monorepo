---
editUrl: false
next: false
prev: false
title: "ExtractAbiFunction"
---

> **ExtractAbiFunction**\<`abi`, `functionName`, `abiStateMutability`\>: `Extract`\<`ExtractAbiFunctions`\<`abi`, `abiStateMutability`\>, `object`\>

Extracts [AbiFunction](../../../../../../../reference/tevm/utils/type-aliases/abifunction) with name from [Abi](../../../../../../../reference/tevm/utils/type-aliases/abi).

## Type Parameters

• **abi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/)

[Abi](../../../../../../../reference/tevm/utils/type-aliases/abi) to extract [AbiFunction](../../../../../../../reference/tevm/utils/type-aliases/abifunction) from

• **functionName** *extends* [`ExtractAbiFunctionNames`](/reference/tevm/utils/type-aliases/extractabifunctionnames/)\<`abi`\>

String name of function to extract from [Abi](../../../../../../../reference/tevm/utils/type-aliases/abi)

• **abiStateMutability** *extends* `AbiStateMutability` = `AbiStateMutability`

AbiStateMutability to filter by

## Defined in

node\_modules/.pnpm/abitype@1.0.6\_typescript@5.6.2\_zod@3.23.8/node\_modules/abitype/dist/types/utils.d.ts:123
