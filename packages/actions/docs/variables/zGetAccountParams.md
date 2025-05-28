[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zGetAccountParams

# Variable: zGetAccountParams

> `const` **zGetAccountParams**: `ZodObject`\<`object` & `object`, `"strip"`, `ZodTypeAny`, \{ `address`: `` `0x${string}` ``; `blockTag?`: `bigint` \| `` `0x${string}` `` \| `"latest"` \| `"earliest"` \| `"pending"` \| `"safe"` \| `"finalized"`; `returnStorage?`: `boolean`; `throwOnFail?`: `boolean`; \}, \{ `address`: `string`; `blockTag?`: `string` \| `number` \| `bigint`; `returnStorage?`: `boolean`; `throwOnFail?`: `boolean`; \}\>

Defined in: [packages/actions/src/GetAccount/zGetAccountParams.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/zGetAccountParams.js#L9)

Zod validator for a valid getAccount action
