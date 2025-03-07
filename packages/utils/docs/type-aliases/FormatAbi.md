[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / FormatAbi

# Type Alias: FormatAbi\<abi\>

> **FormatAbi**\<`abi`\>: [`Abi`](Abi.md) *extends* `abi` ? readonly `string`[] : `abi` *extends* readonly \[\] ? `never` : `abi` *extends* [`Abi`](Abi.md) ? `{ [key in keyof abi]: FormatAbiItem<abi[key]> }` : readonly `string`[]

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.2\_zod@3.24.2/node\_modules/abitype/dist/types/human-readable/formatAbi.d.ts:9

Parses JSON ABI into human-readable ABI

## Type Parameters

• **abi** *extends* [`Abi`](Abi.md) \| readonly `unknown`[]

ABI

## Returns

Human-readable ABI
