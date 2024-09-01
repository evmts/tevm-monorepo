---
editUrl: false
next: false
prev: false
title: "parseAbi"
---

> **parseAbi**\<`signatures`\>(`signatures`): [`ParseAbi`](/reference/tevm/utils/type-aliases/parseabi/)\<`signatures`\>

Parses human-readable ABI into JSON [Abi](../../../../../../../reference/tevm/utils/type-aliases/abi)

## Type Parameters

• **signatures** *extends* readonly `string`[]

Human-Readable ABI

## Parameters

• **signatures**: `signatures`\[`"length"`\] *extends* `0` ? [`"Error: At least one signature required"`] : `Signatures`\<`signatures`\> *extends* `signatures` ? `signatures` : `Signatures`\<`signatures`\>

## Returns

[`ParseAbi`](/reference/tevm/utils/type-aliases/parseabi/)\<`signatures`\>

Parsed [Abi](/reference/reference/tevm/utils/type-aliases/abi/)

## Example

```ts
const abi = parseAbi([
  //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
  'function balanceOf(address owner) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
])
```

## Defined in

node\_modules/.pnpm/abitype@1.0.6\_typescript@5.5.4\_zod@3.23.8/node\_modules/abitype/dist/types/human-readable/parseAbi.d.ts:37
