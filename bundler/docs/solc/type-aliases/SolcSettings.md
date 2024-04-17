**@tevm/bundler** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/bundler](../../README.md) / [solc](../README.md) / SolcSettings

# Type alias: SolcSettings

> **SolcSettings**: `object`

## Type declaration

### debug?

> **`optional`** **debug**: [`SolcDebugSettings`](SolcDebugSettings.md)

### evmVersion?

> **`optional`** **evmVersion**: `"byzantium"` \| `"constantinople"` \| `"petersburg"` \| `"istanbul"` \| `"berlin"` \| `"london"` \| `"paris"`

### libraries?

> **`optional`** **libraries**: `Record`\<`string`, `Record`\<`string`, `string`\>\>

### metadata?

> **`optional`** **metadata**: `SolcMetadataSettings`

### modelChecker?

> **`optional`** **modelChecker**: [`SolcModelChecker`](SolcModelChecker.md)

### optimizer?

> **`optional`** **optimizer**: [`SolcOptimizer`](SolcOptimizer.md)

### outputSelection

> **outputSelection**: [`SolcOutputSelection`](SolcOutputSelection.md)

### remappings?

> **`optional`** **remappings**: [`SolcRemapping`](SolcRemapping.md)

### stopAfter?

> **`optional`** **stopAfter**: `"parsing"`

### viaIR?

> **`optional`** **viaIR**: `boolean`

## Source

bundler-packages/solc/types/src/solcTypes.d.ts:67
