[**@tevm/bundler-cache**](../README.md)

***

[@tevm/bundler-cache](../globals.md) / FileAccessObject

# Type Alias: FileAccessObject

> **FileAccessObject** = `object`

Defined in: types.ts:9

Generalized interface for accessing file system
Allows this package to be used in browser environments or otherwise pluggable

## Properties

### exists()

> **exists**: (`path`) => `Promise`\<`boolean`\>

Defined in: types.ts:14

#### Parameters

##### path

`string`

#### Returns

`Promise`\<`boolean`\>

***

### existsSync()

> **existsSync**: (`path`) => `boolean`

Defined in: types.ts:15

#### Parameters

##### path

`string`

#### Returns

`boolean`

***

### mkdir

> **mkdir**: *typeof* `mkdir`

Defined in: types.ts:19

***

### mkdirSync

> **mkdirSync**: *typeof* `mkdirSync`

Defined in: types.ts:18

***

### readFile()

> **readFile**: (`path`, `encoding`) => `Promise`\<`string`\>

Defined in: types.ts:12

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

Defined in: types.ts:13

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

Defined in: types.ts:17

***

### statSync

> **statSync**: *typeof* `statSync`

Defined in: types.ts:16

***

### writeFile

> **writeFile**: *typeof* `writeFile`

Defined in: types.ts:11

***

### writeFileSync()

> **writeFileSync**: (`path`, `data`) => `void`

Defined in: types.ts:10

#### Parameters

##### path

`string`

##### data

`string`

#### Returns

`void`
