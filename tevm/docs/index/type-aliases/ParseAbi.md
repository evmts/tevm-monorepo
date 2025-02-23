[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / ParseAbi

# Type Alias: ParseAbi\<signatures\>

> **ParseAbi**\<`signatures`\>: `string`[] *extends* `signatures` ? [`Abi`](Abi.md) : `signatures` *extends* readonly `string`[] ? `signatures` *extends* `Signatures`\<`signatures`\> ? `ParseStructs`\<`signatures`\> *extends* infer sructs ? `{ [key in keyof signatures]: signatures[key] extends string ? ParseSignature<signatures[key], sructs> : never }` *extends* infer mapped ? `Filter`\<`mapped`, `never`\> *extends* infer result ? `result` *extends* readonly [] ? `never` : `result` : `never` : `never` : `never` : `never` : `never`

Parses human-readable ABI into JSON [Abi](Abi.md)

## Type Parameters

• **signatures** *extends* readonly `string`[]

Human-readable ABI

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

## Defined in

node\_modules/.pnpm/abitype@1.0.6\_typescript@5.7.3\_zod@3.23.8/node\_modules/abitype/dist/types/human-readable/parseAbi.d.ts:21
