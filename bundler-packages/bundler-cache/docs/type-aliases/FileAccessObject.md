[**@tevm/bundler-cache**](../README.md)

***

[@tevm/bundler-cache](../globals.md) / FileAccessObject

# Type Alias: FileAccessObject

> **FileAccessObject** = `object`

Defined in: [types.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L9)

Generalized interface for accessing file system
Allows this package to be used in browser environments or otherwise pluggable

## Properties

### exists()

> **exists**: (`path`) => `Promise`\<`boolean`\>

Defined in: [types.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L14)

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`boolean`\>

***

### existsSync()

> **existsSync**: (`path`) => `boolean`

Defined in: [types.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L15)

#### Parameters

##### path

`string`

#### Returns

`boolean`

***

### mkdir

> **mkdir**: *typeof* `mkdir`

Defined in: [types.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L19)

***

### mkdirSync

> **mkdirSync**: *typeof* `mkdirSync`

Defined in: [types.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L18)

***

### readFile()

> **readFile**: (`path`, `encoding`) => `Promise`\<`string`\>

Defined in: [types.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L12)

#### Parameters

##### path

`string`

##### encoding

`BufferEncoding`

#### Returns

`Promise`\<`string`\>

***

### readFileSync()

> **readFileSync**: (`path`, `encoding`) => `string`

Defined in: [types.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L13)

#### Parameters

##### path

`string`

##### encoding

`BufferEncoding`

#### Returns

`string`

***

### stat

> **stat**: *typeof* `stat`

Defined in: [types.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L17)

***

### statSync

> **statSync**: *typeof* `statSync`

Defined in: [types.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L16)

***

### writeFile

> **writeFile**: *typeof* `writeFile`

Defined in: [types.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L11)

***

### writeFileSync()

> **writeFileSync**: (`path`, `data`) => `void`

Defined in: [types.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L10)

#### Parameters

##### path

`string`

##### data

`string`

#### Returns

`void`
