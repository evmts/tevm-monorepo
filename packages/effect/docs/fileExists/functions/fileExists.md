**@tevm/effect** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/effect](../../README.md) / [fileExists](../README.md) / fileExists

# Function: fileExists()

`Internal`

> **fileExists**(`path`): `Effect`\<`never`, `never`, `boolean`\>

Checks if a file exists at the given path

## Parameters

• **path**: `string`

path to check

## Returns

`Effect`\<`never`, `never`, `boolean`\>

true if the file exists, false otherwise

## Example

```typescript
import { fileExists } from '@eth-optimism/config'
await fileExists('./someFile.txt')
```

## Source

[packages/effect/src/fileExists.js:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/fileExists.js#L16)
