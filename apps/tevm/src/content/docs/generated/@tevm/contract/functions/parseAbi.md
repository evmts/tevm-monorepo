---
editUrl: false
next: false
prev: false
title: "parseAbi"
---

> **parseAbi**\<`TSignatures`\>(`signatures`): `ParseAbi`\<`TSignatures`\>

Parses human-readable ABI into JSON [Abi]([object Object])

## Type parameters

▪ **TSignatures** extends readonly `string`[]

## Parameters

▪ **signatures**: `TSignatures`[`"length"`] extends `0` ? [`"Error: At least one signature required"`] : `Signatures`\<`TSignatures`\> extends `TSignatures` ? `TSignatures` : `Signatures`\<`TSignatures`\>

Human-Readable ABI

## Returns

Parsed [Abi]([object Object])

## Example

```ts
const abi = parseAbi([
  //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
  'function balanceOf(address owner) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
])
```

## Source

node\_modules/.pnpm/abitype@0.10.2\_typescript@5.3.3\_zod@3.22.4/node\_modules/abitype/dist/types/human-readable/parseAbi.d.ts:37

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
