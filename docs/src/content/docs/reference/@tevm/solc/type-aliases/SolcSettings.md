---
editUrl: false
next: false
prev: false
title: "SolcSettings"
---

> **SolcSettings**: `object`

## Type declaration

### debug

> **debug**?: [`SolcDebugSettings`](/reference/tevm/solc/type-aliases/solcdebugsettings/)

### evmVersion

> **evmVersion**?: `"byzantium"` \| `"constantinople"` \| `"petersburg"` \| `"istanbul"` \| `"berlin"` \| `"london"` \| `"paris"`

### libraries

> **libraries**?: `Record`\<`string`, `Record`\<`string`, `string`\>\>

### metadata

> **metadata**?: [`SolcMetadataSettings`](/reference/tevm/solc/type-aliases/solcmetadatasettings/)

### modelChecker

> **modelChecker**?: [`SolcModelChecker`](/reference/tevm/solc/type-aliases/solcmodelchecker/)

### optimizer

> **optimizer**?: [`SolcOptimizer`](/reference/tevm/solc/type-aliases/solcoptimizer/)

### outputSelection

> **outputSelection**: [`SolcOutputSelection`](/reference/tevm/solc/type-aliases/solcoutputselection/)

### remappings

> **remappings**?: [`SolcRemapping`](/reference/tevm/solc/type-aliases/solcremapping/)

### stopAfter

> **stopAfter**?: `"parsing"`

### viaIR

> **viaIR**?: `boolean`

## Source

[solcTypes.ts:239](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L239)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
