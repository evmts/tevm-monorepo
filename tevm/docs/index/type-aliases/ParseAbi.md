[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / ParseAbi

# Type alias: ParseAbi\<TSignatures\>

> **ParseAbi**\<`TSignatures`\>: `string`[] *extends* `TSignatures` ? [`Abi`](Abi.md) : `TSignatures` *extends* readonly `string`[] ? `TSignatures` *extends* `Signatures`\<`TSignatures`\> ? `ParseStructs`\<`TSignatures`\> *extends* infer Structs ? `{ [K in keyof TSignatures]: TSignatures[K] extends string ? ParseSignature<TSignatures[K], Structs> : never }` *extends* infer Mapped ? `Filter`\<`Mapped`, `never`\> *extends* infer Result ? `Result` *extends* readonly [] ? `never` : `Result` : `never` : `never` : `never` : `never` : `never`

Parses human-readable ABI into JSON [Abi](Abi.md)

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

• **TSignatures** *extends* readonly `string`[]

Human-readable ABI

## Source

node\_modules/.pnpm/abitype@1.0.2\_typescript@5.4.5\_zod@3.23.8/node\_modules/abitype/dist/types/human-readable/parseAbi.d.ts:21
