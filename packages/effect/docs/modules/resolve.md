[@evmts/effect](../README.md) / [Modules](../modules.md) / resolve

# Module: resolve

## Table of contents

### Classes

- [CouldNotResolveImportError](../classes/resolve.CouldNotResolveImportError.md)

### Type Aliases

- [ResolveSafe](resolve.md#resolvesafe)

### Functions

- [resolveAsync](resolve.md#resolveasync)
- [resolveSync](resolve.md#resolvesync)

## Type Aliases

### ResolveSafe

Ƭ **ResolveSafe**\<\>: (`importPath`: `string`, `options`: `SyncOpts` & `AsyncOpts`) => `Effect`

#### Type declaration

▸ (`importPath`, `options`): `Effect`

##### Parameters

| Name | Type |
| :------ | :------ |
| `importPath` | `string` |
| `options` | `SyncOpts` & `AsyncOpts` |

##### Returns

`Effect`

#### Defined in

[packages/effect/src/resolve.js:10](https://github.com/evmts/evmts-monorepo/blob/main/packages/effect/src/resolve.js#L10)

## Functions

### resolveAsync

▸ **resolveAsync**(`importPath`, `options`): `Effect`\<`never`, [`CouldNotResolveImportError`](../classes/resolve.CouldNotResolveImportError.md), `string`\>

Effect wrpper around import('node:resolve')

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `importPath` | `string` | - |
| `options` | `Object` | - |
| `options.basedir?` | `string` | directory to begin resolving from (defaults to __dirname) |
| `options.extensions?` | `string` \| readonly `string`[] | array of file extensions to search in order (defaults to ['.js']) |
| `options.includeCoreModules?` | `boolean` | set to false to exclude node core modules (e.g. fs) from the search |
| `options.isDirectory?` | (`directory`: `string`) => `boolean` & (`directory`: `string`, `cb`: `existsCallback`) => `void` | function to synchronously test whether a directory exists |
| `options.isFile?` | (`file`: `string`) => `boolean` & (`file`: `string`, `cb`: `existsCallback`) => `void` | function to synchronously test whether a file exists |
| `options.moduleDirectory?` | `string` \| readonly `string`[] | directory (or directories) in which to recursively look for modules. (default to 'node_modules') |
| `options.package?` | `any` | package.json data applicable to the module being loaded |
| `options.packageFilter?` | (`pkg`: `JSONObject`, `pkgFile`: `string`, `dir`: `string`) => `JSONObject` | transform the parsed package.json contents before looking at the "main" field |
| `options.packageIterator?` | (`request`: `string`, `start`: `string`, `getPackageCandidates`: () => `string`[], `opts`: `Opts`) => `string`[] | return the list of candidate paths where the packages sources may be found (probably don't use this) |
| `options.pathFilter?` | (`pkg`: `JSONObject`, `path`: `string`, `relativePath`: `string`) => `string` | transform a path within a package |
| `options.paths?` | `string` \| readonly `string`[] | require.paths array to use if nothing is found on the normal node_modules recursive walk (probably don't use this) |
| `options.preserveSymlinks?` | `boolean` | if true, doesn't resolve `basedir` to real path before resolving. This is the way Node resolves dependencies when executed with the --preserve-symlinks flag. Note: this property is currently true by default but it will be changed to false in the next major version because Node's resolution algorithm does not preserve symlinks by default. |
| `options.readFile?` | (`file`: `string`, `cb`: `readFileCallback`) => `void` | how to read files asynchronously (defaults to fs.readFile) |
| `options.readFileSync?` | (`file`: `string`) => `StringOrToString` | how to read files synchronously (defaults to fs.readFileSync) |
| `options.readPackage?` | (`readFile`: (`file`: `string`, `cb`: `readFileCallback`) => `void`, `pkgfile`: `string`, `cb`: `readPackageCallback`) => `void` | function to asynchronously read and parse a package.json file |
| `options.readPackageSync?` | (`readFileSync`: (`file`: `string`) => `StringOrToString`, `pkgfile`: `string`) => `undefined` \| `Record`\<`string`, `unknown`\> | function to synchronously read and parse a package.json file |
| `options.realpath?` | (`file`: `string`, `cb`: `realpathCallback`) => `void` | function to asynchronously resolve a potential symlink to its real path |
| `options.realpathSync?` | (`file`: `string`) => `string` | function to synchronously resolve a potential symlink to its real path |

#### Returns

`Effect`\<`never`, [`CouldNotResolveImportError`](../classes/resolve.CouldNotResolveImportError.md), `string`\>

**`Example`**

```ts
import {tap} from 'effect/Effect'
import {resolveAsync} from '@evmts/effect'
resolveAsync('react').pipe(
   tap(console.log)
)
````

#### Defined in

[packages/effect/src/resolve.js:10](https://github.com/evmts/evmts-monorepo/blob/main/packages/effect/src/resolve.js#L10)

___

### resolveSync

▸ **resolveSync**(`importPath`, `options`): `Effect`\<`never`, [`CouldNotResolveImportError`](../classes/resolve.CouldNotResolveImportError.md), `string`\>

Effect wrapper around import('node:resolve').resolveSync

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `importPath` | `string` | - |
| `options` | `Object` | - |
| `options.basedir?` | `string` | directory to begin resolving from (defaults to __dirname) |
| `options.extensions?` | `string` \| readonly `string`[] | array of file extensions to search in order (defaults to ['.js']) |
| `options.includeCoreModules?` | `boolean` | set to false to exclude node core modules (e.g. fs) from the search |
| `options.isDirectory?` | (`directory`: `string`) => `boolean` & (`directory`: `string`, `cb`: `existsCallback`) => `void` | function to synchronously test whether a directory exists |
| `options.isFile?` | (`file`: `string`) => `boolean` & (`file`: `string`, `cb`: `existsCallback`) => `void` | function to synchronously test whether a file exists |
| `options.moduleDirectory?` | `string` \| readonly `string`[] | directory (or directories) in which to recursively look for modules. (default to 'node_modules') |
| `options.package?` | `any` | package.json data applicable to the module being loaded |
| `options.packageFilter?` | (`pkg`: `JSONObject`, `pkgFile`: `string`, `dir`: `string`) => `JSONObject` | transform the parsed package.json contents before looking at the "main" field |
| `options.packageIterator?` | (`request`: `string`, `start`: `string`, `getPackageCandidates`: () => `string`[], `opts`: `Opts`) => `string`[] | return the list of candidate paths where the packages sources may be found (probably don't use this) |
| `options.pathFilter?` | (`pkg`: `JSONObject`, `path`: `string`, `relativePath`: `string`) => `string` | transform a path within a package |
| `options.paths?` | `string` \| readonly `string`[] | require.paths array to use if nothing is found on the normal node_modules recursive walk (probably don't use this) |
| `options.preserveSymlinks?` | `boolean` | if true, doesn't resolve `basedir` to real path before resolving. This is the way Node resolves dependencies when executed with the --preserve-symlinks flag. Note: this property is currently true by default but it will be changed to false in the next major version because Node's resolution algorithm does not preserve symlinks by default. |
| `options.readFile?` | (`file`: `string`, `cb`: `readFileCallback`) => `void` | how to read files asynchronously (defaults to fs.readFile) |
| `options.readFileSync?` | (`file`: `string`) => `StringOrToString` | how to read files synchronously (defaults to fs.readFileSync) |
| `options.readPackage?` | (`readFile`: (`file`: `string`, `cb`: `readFileCallback`) => `void`, `pkgfile`: `string`, `cb`: `readPackageCallback`) => `void` | function to asynchronously read and parse a package.json file |
| `options.readPackageSync?` | (`readFileSync`: (`file`: `string`) => `StringOrToString`, `pkgfile`: `string`) => `undefined` \| `Record`\<`string`, `unknown`\> | function to synchronously read and parse a package.json file |
| `options.realpath?` | (`file`: `string`, `cb`: `realpathCallback`) => `void` | function to asynchronously resolve a potential symlink to its real path |
| `options.realpathSync?` | (`file`: `string`) => `string` | function to synchronously resolve a potential symlink to its real path |

#### Returns

`Effect`\<`never`, [`CouldNotResolveImportError`](../classes/resolve.CouldNotResolveImportError.md), `string`\>

**`Example`**

```ts
import {tap} from 'effect/Effect'
import {resolveSync} from '@evmts/effect'
resolveSync('react').pipe(
   tap(console.log)
)
````
`

#### Defined in

[packages/effect/src/resolve.js:10](https://github.com/evmts/evmts-monorepo/blob/main/packages/effect/src/resolve.js#L10)
