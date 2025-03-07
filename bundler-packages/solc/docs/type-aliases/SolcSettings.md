[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcSettings

# Type Alias: SolcSettings

> **SolcSettings**: `object`

Defined in: [solcTypes.ts:239](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L239)

## Type declaration

### debug?

> `optional` **debug**: [`SolcDebugSettings`](SolcDebugSettings.md)

### evmVersion?

> `optional` **evmVersion**: `"byzantium"` \| `"constantinople"` \| `"petersburg"` \| `"istanbul"` \| `"berlin"` \| `"london"` \| `"paris"`

### libraries?

> `optional` **libraries**: `Record`\<`string`, `Record`\<`string`, `string`\>\>

### metadata?

> `optional` **metadata**: [`SolcMetadataSettings`](SolcMetadataSettings.md)

### modelChecker?

> `optional` **modelChecker**: [`SolcModelChecker`](SolcModelChecker.md)

### optimizer?

> `optional` **optimizer**: [`SolcOptimizer`](SolcOptimizer.md)

### outputSelection

> **outputSelection**: [`SolcOutputSelection`](SolcOutputSelection.md)

### remappings?

> `optional` **remappings**: [`SolcRemapping`](SolcRemapping.md)

### stopAfter?

> `optional` **stopAfter**: `"parsing"`

### viaIR?

> `optional` **viaIR**: `boolean`
