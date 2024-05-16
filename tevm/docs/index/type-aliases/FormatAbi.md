[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / FormatAbi

# Type alias: FormatAbi\<TAbi\>

> **FormatAbi**\<`TAbi`\>: [`Abi`](Abi.md) *extends* `TAbi` ? readonly `string`[] : `TAbi` *extends* readonly [] ? `never` : `TAbi` *extends* [`Abi`](Abi.md) ? `{ [K in keyof TAbi]: FormatAbiItem<TAbi[K]> }` : readonly `string`[]

Parses JSON ABI into human-readable ABI

## Type parameters

• **TAbi** *extends* [`Abi`](Abi.md) \| readonly `unknown`[]

ABI

## Source

node\_modules/.pnpm/abitype@1.0.2\_typescript@5.4.5\_zod@3.23.8/node\_modules/abitype/dist/types/human-readable/formatAbi.d.ts:9
