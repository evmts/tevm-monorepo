---
editUrl: false
next: false
prev: false
title: "ExtractAbiEvent"
---

> **ExtractAbiEvent**\<`TAbi`, `TEventName`\>: `Extract`\<[`ExtractAbiEvents`](/reference/tevm/utils/type-aliases/extractabievents/)\<`TAbi`\>, `object`\>

Extracts [AbiEvent](/reference/tevm/utils/type-aliases/abievent/) with name from [Abi](/reference/tevm/utils/type-aliases/abi/).

## Type parameters

| Parameter | Description |
| :------ | :------ |
| `TAbi` extends [`Abi`](/reference/tevm/utils/type-aliases/abi/) | [Abi](/reference/tevm/utils/type-aliases/abi/) to extract [AbiEvent](/reference/tevm/utils/type-aliases/abievent/) from |
| `TEventName` extends [`ExtractAbiEventNames`](/reference/tevm/utils/type-aliases/extractabieventnames/)\<`TAbi`\> | String name of event to extract from [Abi](/reference/tevm/utils/type-aliases/abi/) |

## Source

node\_modules/.pnpm/abitype@1.0.0\_typescript@5.3.3\_zod@3.22.4/node\_modules/abitype/dist/types/utils.d.ts:149

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
