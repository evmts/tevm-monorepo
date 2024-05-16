---
editUrl: false
next: false
prev: false
title: "parseAbi"
---

> **parseAbi**\<`TSignatures`\>(`signatures`): [`ParseAbi`](/reference/tevm/utils/type-aliases/parseabi/)\<`TSignatures`\>

Parses human-readable ABI into JSON [Abi](../../../../../../../reference/tevm/utils/type-aliases/abi)

## Type parameters

• **TSignatures** *extends* readonly `string`[]

## Parameters

• **signatures**: `TSignatures`\[`"length"`\] *extends* `0` ? [`"Error: At least one signature required"`] : `Signatures`\<`TSignatures`\> *extends* `TSignatures` ? `TSignatures` : `Signatures`\<`TSignatures`\>

Human-Readable ABI

## Returns

[`ParseAbi`](/reference/tevm/utils/type-aliases/parseabi/)\<`TSignatures`\>

Parsed [Abi](/reference/reference/tevm/utils/type-aliases/abi/)

## Example

```ts
const abi = parseAbi([
  //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
  'function balanceOf(address owner) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
])
```

## Source

node\_modules/.pnpm/abitype@1.0.2\_typescript@5.4.5\_zod@3.23.8/node\_modules/abitype/dist/types/human-readable/parseAbi.d.ts:37
