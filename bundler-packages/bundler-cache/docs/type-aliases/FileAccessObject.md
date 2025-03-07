[**@tevm/bundler-cache**](../README.md)

***

[@tevm/bundler-cache](../globals.md) / FileAccessObject

# Type Alias: FileAccessObject

> **FileAccessObject**: `object`

Defined in: [types.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/bundler-cache/src/types.ts#L9)

Generalized interface for accessing file system
Allows this package to be used in browser environments or otherwise pluggable

## Type declaration

### exists()

> **exists**: (`path`) => `Promise`\<`boolean`\>

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`boolean`\>

### existsSync()

> **existsSync**: (`path`) => `boolean`

#### Parameters

##### path

`string`

#### Returns

`boolean`

### mkdir

> **mkdir**: *typeof* `mkdir`

### mkdirSync

> **mkdirSync**: *typeof* `mkdirSync`

### readFile()

> **readFile**: (`path`, `encoding`) => `Promise`\<`string`\>

#### Parameters

##### path

`string`

##### encoding

`BufferEncoding`

#### Returns

`Promise`\<`string`\>

### readFileSync()

> **readFileSync**: (`path`, `encoding`) => `string`

#### Parameters

##### path

`string`

##### encoding

`BufferEncoding`

#### Returns

`string`

### stat

> **stat**: *typeof* `stat`

### statSync

> **statSync**: *typeof* `statSync`

### writeFile

> **writeFile**: *typeof* `writeFile`

### writeFileSync()

> **writeFileSync**: (`path`, `data`) => `void`

#### Parameters

##### path

`string`

##### data

`string`

#### Returns

`void`
