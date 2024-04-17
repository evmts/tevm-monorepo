---
editUrl: false
next: false
prev: false
title: "SolcSettings"
---

> **SolcSettings**: `object`

## Type declaration

### debug?

> **`optional`** **debug**: [`SolcDebugSettings`](/reference/tevm/solc/type-aliases/solcdebugsettings/)

### evmVersion?

> **`optional`** **evmVersion**: `"byzantium"` \| `"constantinople"` \| `"petersburg"` \| `"istanbul"` \| `"berlin"` \| `"london"` \| `"paris"`

### libraries?

> **`optional`** **libraries**: `Record`\<`string`, `Record`\<`string`, `string`\>\>

### metadata?

> **`optional`** **metadata**: [`SolcMetadataSettings`](/reference/tevm/solc/type-aliases/solcmetadatasettings/)

### modelChecker?

> **`optional`** **modelChecker**: [`SolcModelChecker`](/reference/tevm/solc/type-aliases/solcmodelchecker/)

### optimizer?

> **`optional`** **optimizer**: [`SolcOptimizer`](/reference/tevm/solc/type-aliases/solcoptimizer/)

### outputSelection

> **outputSelection**: [`SolcOutputSelection`](/reference/tevm/solc/type-aliases/solcoutputselection/)

### remappings?

> **`optional`** **remappings**: [`SolcRemapping`](/reference/tevm/solc/type-aliases/solcremapping/)

### stopAfter?

> **`optional`** **stopAfter**: `"parsing"`

### viaIR?

> **`optional`** **viaIR**: `boolean`

## Source

[solcTypes.ts:239](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L239)
