---
editUrl: false
next: false
prev: false
title: "FormatAbi"
---

> **FormatAbi**\<`abi`\>: [`Abi`](/reference/tevm/utils/type-aliases/abi/) *extends* `abi` ? readonly `string`[] : `abi` *extends* readonly [] ? `never` : `abi` *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) ? `{ [key in keyof abi]: FormatAbiItem<abi[key]> }` : readonly `string`[]

Parses JSON ABI into human-readable ABI

## Type Parameters

• **abi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[]

ABI

## Defined in

node\_modules/.pnpm/abitype@1.0.6\_typescript@5.6.2\_zod@3.23.8/node\_modules/abitype/dist/types/human-readable/formatAbi.d.ts:9
