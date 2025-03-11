[**@tevm/bundler-cache**](README.md)

***

# @tevm/bundler-cache

## Example

```javascript
import { createCache } from '@tevm/bundler-cache'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { mkdir, readFile, stat, writeFile } from 'fs/promises'

// Create a file access object with required methods
const fs = {
  existsSync,
  exists: async (path) => existsSync(path),
  readFile: (path, encoding) => readFile(path, { encoding }),
  readFileSync,
  writeFileSync,
  writeFile,
  statSync,
  stat,
  mkdirSync,
  mkdir
}

// Create a cache instance
const cache = createCache(
  '.tevm',        // Cache directory
  fs,             // File access object
  process.cwd()   // Current working directory
)

// Read cached artifacts
const artifacts = await cache.readArtifacts('./contracts/Counter.sol')

// Write artifacts to cache
await cache.writeArtifacts('./contracts/Counter.sol', compiledContracts)
```

## Type Aliases

- [Cache](type-aliases/Cache.md)
- [CachedItem](type-aliases/CachedItem.md)
- [FileAccessObject](type-aliases/FileAccessObject.md)

## Functions

- [createCache](functions/createCache.md)
