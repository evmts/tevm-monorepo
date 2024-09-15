[**@tevm/resolutions**](../../README.md) • **Docs**

***

[@tevm/resolutions](../../modules.md) / [moduleFactory](../README.md) / moduleFactory

# Function: moduleFactory()

> **moduleFactory**(`absolutePath`, `rawCode`, `remappings`, `libs`, `fao`, `sync`): `Effect`\<`never`, [`ModuleFactoryError`](../type-aliases/ModuleFactoryError.md), `Map`\<`string`, [`ModuleInfo`](../../types/interfaces/ModuleInfo.md)\>\>

## Parameters

• **absolutePath**: `string`

• **rawCode**: `string`

• **remappings**: `Record`\<`string`, `string`\>

• **libs**: readonly `string`[]

• **fao**: [`FileAccessObject`](../../types/type-aliases/FileAccessObject.md)

• **sync**: `boolean`

Whether to run this synchronously or not

## Returns

`Effect`\<`never`, [`ModuleFactoryError`](../type-aliases/ModuleFactoryError.md), `Map`\<`string`, [`ModuleInfo`](../../types/interfaces/ModuleInfo.md)\>\>

## Defined in

[moduleFactory.js:53](https://github.com/qbzzt/tevm-monorepo/blob/main/bundler-packages/resolutions/src/moduleFactory.js#L53)
