[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / FormatAbi

# Type Alias: FormatAbi\<abi\>

> **FormatAbi**\<`abi`\> = [`Abi`](Abi.md) *extends* `abi` ? readonly `string`[] : `abi` *extends* readonly \[\] ? `never` : `abi` *extends* [`Abi`](Abi.md) ? `{ [key in keyof abi]: FormatAbiItem<abi[key]> }` : readonly `string`[]

Defined in: tevm-monorepo/node\_modules/.pnpm/abitype@1.2.4\_typescript@6.0.3\_zod@4.4.3/node\_modules/abitype/dist/types/human-readable/formatAbi.d.ts:9

Parses JSON ABI into human-readable ABI

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `abi` *extends* [`Abi`](Abi.md) \| readonly `unknown`[] | ABI |

## Returns

Human-readable ABI
