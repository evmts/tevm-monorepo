---
editUrl: false
next: false
prev: false
title: "AbiParametersToPrimitiveTypes"
---

> **AbiParametersToPrimitiveTypes**\<`TAbiParameters`, `TAbiParameterKind`\>: `Pretty`\<`{ [K in keyof TAbiParameters]: AbiParameterToPrimitiveType<TAbiParameters[K], TAbiParameterKind> }`\>

Converts array of AbiParameter to corresponding TypeScript primitive types.

## Type parameters

• **TAbiParameters** *extends* readonly `AbiParameter`[]

Array of AbiParameter to convert to TypeScript representations

• **TAbiParameterKind** *extends* `AbiParameterKind` = `AbiParameterKind`

Optional AbiParameterKind to narrow by parameter type

## Source

node\_modules/.pnpm/abitype@1.0.2\_typescript@5.5.2\_zod@3.23.8/node\_modules/abitype/dist/types/utils.d.ts:86
