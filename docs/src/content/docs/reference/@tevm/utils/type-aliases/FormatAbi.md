---
editUrl: false
next: false
prev: false
title: "FormatAbi"
---

> **FormatAbi**\<`TAbi`\>: [`Abi`](/reference/tevm/utils/type-aliases/abi/) *extends* `TAbi` ? readonly `string`[] : `TAbi` *extends* readonly [] ? `never` : `TAbi` *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) ? `{ [K in keyof TAbi]: FormatAbiItem<TAbi[K]> }` : readonly `string`[]

Parses JSON ABI into human-readable ABI

## Type parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[]

ABI

## Source

node\_modules/.pnpm/abitype@1.0.2\_typescript@5.4.5\_zod@3.23.8/node\_modules/abitype/dist/types/human-readable/formatAbi.d.ts:9
