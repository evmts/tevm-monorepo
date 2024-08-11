[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / FormatAbi

# Type Alias: FormatAbi\<abi\>

> **FormatAbi**\<`abi`\>: [`Abi`](Abi.md) *extends* `abi` ? readonly `string`[] : `abi` *extends* readonly [] ? `never` : `abi` *extends* [`Abi`](Abi.md) ? `{ [key in keyof abi]: FormatAbiItem<abi[key]> }` : readonly `string`[]

Parses JSON ABI into human-readable ABI

## Type Parameters

• **abi** *extends* [`Abi`](Abi.md) \| readonly `unknown`[]

ABI

## Defined in

node\_modules/.pnpm/abitype@1.0.4\_typescript@5.5.4\_zod@3.23.8/node\_modules/abitype/dist/types/human-readable/formatAbi.d.ts:9
