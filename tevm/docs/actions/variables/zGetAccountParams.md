[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zGetAccountParams

# Variable: zGetAccountParams

> `const` **zGetAccountParams**: `z.ZodObject`\<`object` & `object`, `"strip"`, `z.ZodTypeAny`, \{ `address`: `` `0x${string}` ``; `blockTag?`: `bigint` \| `` `0x${string}` `` \| `"latest"` \| `"earliest"` \| `"pending"` \| `"safe"` \| `"finalized"`; `returnStorage?`: `boolean`; `throwOnFail?`: `boolean`; \}, \{ `address`: `string`; `blockTag?`: `string` \| `number` \| `bigint`; `returnStorage?`: `boolean`; `throwOnFail?`: `boolean`; \}\>

Defined in: packages/actions/types/GetAccount/zGetAccountParams.d.ts:4

Zod validator for a valid getAccount action
