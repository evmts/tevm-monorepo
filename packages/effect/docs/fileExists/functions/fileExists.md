**@tevm/effect** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [fileExists](../README.md) > fileExists

# Function: fileExists()

> **fileExists**(`path`): `Effect`\<`never`, `never`, `boolean`\>

Checks if a file exists at the given path

## Parameters

▪ **path**: `string`

path to check

## Returns

true if the file exists, false otherwise

## Example

```typescript
import { fileExists } from '@eth-optimism/config'
await fileExists('./someFile.txt')
```

## Source

[packages/effect/src/fileExists.js:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/fileExists.js#L16)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
