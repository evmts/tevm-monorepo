[**@tevm/bundler-cache**](../README.md)

***

[@tevm/bundler-cache](../globals.md) / createCache

# Function: createCache()

> **createCache**(`cacheDir`, `fs`, `cwd`): [`Cache`](../type-aliases/Cache.md)

Defined in: createCache.js:57

Creates a cache object for reading and writing Solidity compilation artifacts
and generated code files.

The cache system helps improve build performance by storing compiled Solidity artifacts
and generated TypeScript/JavaScript files on disk, avoiding unnecessary recompilation
when source files haven't changed.

This cache is used by various Tevm bundler plugins to provide consistent and efficient
caching across different build systems.

## Parameters

### cacheDir

`string`

Directory where cache files will be stored (relative to cwd)

### fs

[`FileAccessObject`](../type-aliases/FileAccessObject.md)

File system interface for reading/writing

### cwd

`string`

Current working directory, used as base for resolving paths

## Returns

[`Cache`](../type-aliases/Cache.md)

Cache object with methods for reading and writing

## Example

```javascript
import { createCache } from '@tevm/bundler-cache'
import { bundler } from '@tevm/base-bundler'
import * as fs from 'node:fs'
import * as fsPromises from 'node:fs/promises'

// Create a file access object
const fileAccess = {
  readFile: fsPromises.readFile,
  readFileSync: fs.readFileSync,
  writeFile: fsPromises.writeFile,
  writeFileSync: fs.writeFileSync,
  exists: async (path) => fs.existsSync(path),
  existsSync: fs.existsSync,
  statSync: fs.statSync,
  stat: fsPromises.stat,
  mkdirSync: fs.mkdirSync,
  mkdir: fsPromises.mkdir
}

// Create the cache
const cache = createCache('.tevm', fileAccess, process.cwd())

// Later, use with the bundler
const myBundler = bundler(
  tevmConfig,
  console,
  fileAccess,
  solcCompiler,
  cache // Pass the cache instance
)
```
