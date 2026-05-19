[**@tevm/requirejs-plugin**](../README.md)

***

[@tevm/requirejs-plugin](../globals.md) / requirejsFileAccessObject

# Variable: requirejsFileAccessObject

> `const` **requirejsFileAccessObject**: `FileAccessObject`

Defined in: [requirejsFileAccessObject.js:38](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/requirejs/src/requirejsFileAccessObject.js#L38)

An adapter around the Node.js fs API that implements the FileAccessObject interface
required by @tevm/base-bundler.

This object provides a complete implementation of the FileAccessObject interface using
standard Node.js file system functions, which is used by Tevm bundlers to read and write
files during the Solidity compilation process.

## Example

```javascript
import { requirejsFileAccessObject } from '@tevm/requirejs'
import { bundler } from '@tevm/base-bundler'

// Use in Tevm bundler
const tevmBundler = bundler(
  config,
  console,
  requirejsFileAccessObject, // Pass the file access object
  solcCompiler,
  cacheInstance
)

// Or use directly
const fileExists = await requirejsFileAccessObject.exists('./contracts/Token.sol')
if (fileExists) {
  const content = await requirejsFileAccessObject.readFile('./contracts/Token.sol', 'utf8')
  console.log(content)
}
```

## See

[Node.js File System Documentation](https://nodejs.org/api/fs.html)
