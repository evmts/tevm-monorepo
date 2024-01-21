**@tevm/bundler** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [solc](../README.md) > SolcSettings

# Type alias: SolcSettings

> **SolcSettings**: `object`

## Type declaration

### debug

> **debug**?: [`SolcDebugSettings`](SolcDebugSettings.md)

### evmVersion

> **evmVersion**?: `"byzantium"` \| `"constantinople"` \| `"petersburg"` \| `"istanbul"` \| `"berlin"` \| `"london"` \| `"paris"`

### libraries

> **libraries**?: `Record`\<`string`, `Record`\<`string`, `string`\>\>

### metadata

> **metadata**?: `SolcMetadataSettings`

### modelChecker

> **modelChecker**?: [`SolcModelChecker`](SolcModelChecker.md)

### optimizer

> **optimizer**?: [`SolcOptimizer`](SolcOptimizer.md)

### outputSelection

> **outputSelection**: [`SolcOutputSelection`](SolcOutputSelection.md)

### remappings

> **remappings**?: [`SolcRemapping`](SolcRemapping.md)

### stopAfter

> **stopAfter**?: `"parsing"`

### viaIR

> **viaIR**?: `boolean`

## Source

bundler-packages/solc/types/src/solcTypes.d.ts:67

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
