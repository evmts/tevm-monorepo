---
editUrl: false
next: false
prev: false
title: "moduleFactory"
---

> **moduleFactory**(`absolutePath`, `rawCode`, `remappings`, `libs`, `fao`, `sync`): `Effect`\<`never`, [`ModuleFactoryError`](/reference/tevm/resolutions/modulefactory/type-aliases/modulefactoryerror/), `Map`\<`string`, [`ModuleInfo`](/reference/tevm/resolutions/types/interfaces/moduleinfo/)\>\>

## Parameters

• **absolutePath**: `string`

• **rawCode**: `string`

• **remappings**: `Record`\<`string`, `string`\>

• **libs**: readonly `string`[]

• **fao**: [`FileAccessObject`](/reference/tevm/resolutions/types/type-aliases/fileaccessobject/)

• **sync**: `boolean`

Whether to run this synchronously or not

## Returns

`Effect`\<`never`, [`ModuleFactoryError`](/reference/tevm/resolutions/modulefactory/type-aliases/modulefactoryerror/), `Map`\<`string`, [`ModuleInfo`](/reference/tevm/resolutions/types/interfaces/moduleinfo/)\>\>

## Defined in

[moduleFactory.js:53](https://github.com/qbzzt/tevm-monorepo/blob/main/bundler-packages/resolutions/src/moduleFactory.js#L53)
