[**@tevm/bun-plugin**](../README.md)

***

[@tevm/bun-plugin](../globals.md) / bunFileAccesObject

# Variable: bunFileAccesObject

> `const` **bunFileAccesObject**: `FileAccessObject`

Defined in: bundler-packages/bun/src/bunFileAccessObject.js:39

An adapter around the Bun file API that implements the FileAccessObject interface
required by @tevm/base-bundler.

This object combines Node.js file system functions with Bun's optimized file API
to provide a complete implementation of the FileAccessObject interface, which is
used by Tevm bundlers to read and write files during the Solidity compilation process.

## Example

```javascript
import { bunFileAccesObject } from '@tevm/bun'
import { bundler } from '@tevm/base-bundler'

// Use in Tevm bundler
const tevmBundler = bundler(
  config,
  console,
  bunFileAccesObject, // Pass the file access object
  solcCompiler,
  cacheInstance
)

// Or use directly
const fileExists = await bunFileAccesObject.exists('./contracts/Token.sol')
if (fileExists) {
  const content = await bunFileAccesObject.readFile('./contracts/Token.sol', 'utf8')
  console.log(content)
}
```

## See

[Bun File I/O Documentation](https://bun.sh/docs/api/file-io)
