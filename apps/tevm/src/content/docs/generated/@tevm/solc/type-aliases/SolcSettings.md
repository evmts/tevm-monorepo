---
editUrl: false
next: false
prev: false
title: "SolcSettings"
---

> **SolcSettings**: `object`

## Type declaration

### debug

> **debug**?: [`SolcDebugSettings`](/generated/tevm/solc/type-aliases/solcdebugsettings/)

### evmVersion

> **evmVersion**?: `"byzantium"` \| `"constantinople"` \| `"petersburg"` \| `"istanbul"` \| `"berlin"` \| `"london"` \| `"paris"`

### libraries

> **libraries**?: `Record`\<`string`, `Record`\<`string`, `string`\>\>

### metadata

> **metadata**?: [`SolcMetadataSettings`](/generated/tevm/solc/type-aliases/solcmetadatasettings/)

### modelChecker

> **modelChecker**?: [`SolcModelChecker`](/generated/tevm/solc/type-aliases/solcmodelchecker/)

### optimizer

> **optimizer**?: [`SolcOptimizer`](/generated/tevm/solc/type-aliases/solcoptimizer/)

### outputSelection

> **outputSelection**: [`SolcOutputSelection`](/generated/tevm/solc/type-aliases/solcoutputselection/)

### remappings

> **remappings**?: [`SolcRemapping`](/generated/tevm/solc/type-aliases/solcremapping/)

### stopAfter

> **stopAfter**?: `"parsing"`

### viaIR

> **viaIR**?: `boolean`

## Source

[solcTypes.ts:239](https://github.com/evmts/tevm-monorepo/blob/main/bundler/solc/src/solcTypes.ts#L239)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
