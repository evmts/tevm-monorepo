---
editUrl: false
next: false
prev: false
title: "ParseAbi"
---

> **ParseAbi**\<`TSignatures`\>: `string`[] extends `TSignatures` ? [`Abi`](/reference/tevm/utils/type-aliases/abi/) : `TSignatures` extends readonly `string`[] ? `TSignatures` extends `Signatures`\<`TSignatures`\> ? `ParseStructs`\<`TSignatures`\> extends infer Structs ? `{ [K in keyof TSignatures]: TSignatures[K] extends string ? ParseSignature<TSignatures[K], Structs> : never }` extends infer Mapped ? `Filter`\<`Mapped`, `never`\> extends infer Result ? `Result` extends readonly [] ? `never` : `Result` : `never` : `never` : `never` : `never` : `never`

Parses human-readable ABI into JSON [Abi](/reference/tevm/utils/type-aliases/abi/)

## Example

```ts
type Result = ParseAbi<
  // ^? type Result = readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
  [
    'function balanceOf(address owner) view returns (uint256)',
    'event Transfer(address indexed from, address indexed to, uint256 amount)',
  ]
>
```

## Type parameters

| Parameter | Description |
| :------ | :------ |
| `TSignatures` extends readonly `string`[] | Human-readable ABI |

## Source

node\_modules/.pnpm/abitype@1.0.0\_typescript@5.3.3\_zod@3.22.4/node\_modules/abitype/dist/types/human-readable/parseAbi.d.ts:21

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
