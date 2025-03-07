[**@tevm/effect**](../../README.md)

***

[@tevm/effect](../../modules.md) / [fileExists](../README.md) / fileExists

# Function: fileExists()

> **fileExists**(`path`): `Effect`\<`boolean`, `never`, `never`\>

Defined in: [packages/effect/src/fileExists.js:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/fileExists.js#L16)

Checks if a file exists at the given path

## Parameters

### path

`string`

path to check

## Returns

`Effect`\<`boolean`, `never`, `never`\>

true if the file exists, false otherwise

## Example

```typescript
import { fileExists } from '@eth-optimism/config'
await fileExists('./someFile.txt')
```
