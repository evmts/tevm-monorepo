[**@tevm/bundler-cache**](../README.md)

***

[@tevm/bundler-cache](../globals.md) / FileAccessObject

# Type Alias: FileAccessObject

> **FileAccessObject** = `object`

Defined in: [types.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L9)

Generalized interface for accessing file system
Allows this package to be used in browser environments or otherwise pluggable

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="exists"></a> `exists` | (`path`) => `Promise`\<`boolean`\> | [types.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L14) |
| <a id="existssync"></a> `existsSync` | (`path`) => `boolean` | [types.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L15) |
| <a id="mkdir"></a> `mkdir` | *typeof* `mkdir` | [types.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L19) |
| <a id="mkdirsync"></a> `mkdirSync` | *typeof* `mkdirSync` | [types.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L18) |
| <a id="readfile"></a> `readFile` | (`path`, `encoding`) => `Promise`\<`string`\> | [types.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L12) |
| <a id="readfilesync"></a> `readFileSync` | (`path`, `encoding`) => `string` | [types.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L13) |
| <a id="rename"></a> `rename?` | *typeof* `rename` | [types.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L21) |
| <a id="renamesync"></a> `renameSync?` | *typeof* `renameSync` | [types.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L20) |
| <a id="stat"></a> `stat` | *typeof* `stat` | [types.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L17) |
| <a id="statsync"></a> `statSync` | *typeof* `statSync` | [types.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L16) |
| <a id="writefile"></a> `writeFile` | *typeof* `writeFile` | [types.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L11) |
| <a id="writefilesync"></a> `writeFileSync` | (`path`, `data`) => `void` | [types.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L10) |
