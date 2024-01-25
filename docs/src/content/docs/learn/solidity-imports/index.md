---
title: Bundler Guide
description: A guide to getting solidity imports with the tevm bundler
---

Solidity imports simplify your tevm code via compiling contracts to ABI and bytecode consumable by JavaScript directly in your JavaScript build pipeline. Solidity imports are purely optional but highly recomended.

## Requirements

To support solidity imports the following steps must be taken:

1. Configure a [bundler](https://dev.to/sayanide/the-what-why-and-how-of-javascript-bundlers-4po9) to turn your solidity imports into [tevm scripts](/reference/tevm/contract/type-aliases/script).
2. Configure your [TypeScript LSP](https://microsoft.github.io/language-server-protocol/) to recognize solidity imports correctly as well
3. Optionally Configure your `tevm.config.json`
4. Some may need to configure their editor

## Installation

All tevm build tool can be installed via the `@tevm/bundler` package.

```bash
npm install @tevm/bundler
```

After installing you can use any tevm build tool package via a deep import to it's subpackage.

```typescript
import {rollupPluginTevm} from '@tevm/bundler/rollup-plugin'
```

It is also possible to install these subpackages as standalone packages if you prefer.

```
npm install @tevm/rollup-plugin
```

## How it works

#### Core bundler

A JavaScript bundler is code that runs at buildtime to turn an import graph into a single file or multiple files. [@tevm/base-bundler](https://github.com/evmts/tevm-monorepo/tree/main/bundler-packages/base-bundler) turns Solidity imports into [tevm script instances](/reference/tevm/contract/type-aliases/script). The core Tevm bundler code is reused to build every bundler integration.

1. On initialization tevm bundler and LSP will load your tsconfig (to read basedir and paths), foundry remappings (if configured), and `tevm.config.json` if present

2. Next it will look for import paths ending in `.sol`. When it sees one it will use [node resolution](https://medium.com/outbrain-engineering/node-js-module-resolution-af46715784ef) to find the file. If a JavaScript file e.g. `.sol.js` file already exists it will immediately resolve that. Otherwise it kicks off the process of resolving the contract into it's ABI and bytecode.

```typescript
import {ERC20} from '@openzeppelin/contracts/tokens/ERC20/ERC20.sol'
```

3. Before it compiles the contracts it will first resolve the entire solidity import resolution graph and source code with [@tevm/resolutions](https://github.com/evmts/tevm-monorepo/tree/main/bundler-packages/resolutions). This resolutions will continue resolving imports in solidity files based on `node resolution`, foundry configuration (if foundry is configured), and your `tevm.config.json` remappings and lib.

4. If content hasn't changed it will return the results from the cache

5. If content has changed it will then pass in all the relavent contract code into [solc](https://github.com/evmts/tevm-monorepo/tree/main/bundler-packages/solc)

6. Once it gets the artifacts it will then use the [@tevm/contracts](/learn/contracts) to turn the artifacts into a `TevmContract` or `TevmScript` via the [@tevm/runtime] package. The runtime code will look like the following:

```javascript
import { createContract } from '@tevm/contract'
const _ERC20 = {
	name: 'ERC20',
	humanReadableAbi: [
		'constructor()',
		'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
		'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
		'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
		'function approve(address to, uint256 tokenId)',
		'function balanceOf(address owner) view returns (uint256)',
		'function getApproved(uint256 tokenId) view returns (address)',
		'function isApprovedForAll(address owner, address operator) view returns (bool)',
		'function mint()',
		'function mint(uint256 tokenId)',
		'function name() view returns (string)',
		'function ownerOf(uint256 tokenId) view returns (address)',
		'function safeTransferFrom(address from, address to, uint256 tokenId)',
		'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)',
		'function setApprovalForAll(address operator, bool approved)',
		'function supportsInterface(bytes4 interfaceid) view returns (bool)',
		'function symbol() view returns (string)',
		'function tokenURI(uint256 tokenId) pure returns (string)',
		'function totalSupply() view returns (uint256)',
		'function transferFrom(address from, address to, uint256 tokenId)',
	],
}
/**
 * Jsdoc comments will be included
 * @property mint() Allows an address to mint
 */
export const ERC20 = createContract(_wagmimintexample)
```

The TypeScript plugin generates a similar dts file.

## Bundler integrations

The [@tevm/base-bundler](https://github.com/evmts/tevm-monorepo/tree/main/bundler-packages/base-bundler) is used to create the following bundler integrations. Click on your bundler of choice to see the reference docs for your bundler.

- [bun](/reference/tevm/bun-plugin/functions/bunplugintevm) 
- [esbuild](/reference/tevm/esbuild-plugin/functions/esbuildplugintevm) 
- [rollup](/reference/tevm/rollup-plugin/functions/rollupplugintevm) 
- [vite](/reference/tevm/vite-plugin/functions/viteplugintevm) 
- [rspack](/reference/tevm/rspack-plugin/functions/rspackplugintevm) 
- [webpack](/reference/tevm/webpack-plugin/variables/webpackplugintevm) 

If your bundler is not supported consider [opening an issue](https://github.com/evmts/tevm-monorepo/issues/new) as it is likely a small lift to add support.

## LSP

Once you integrate a bundler your code will run correctly but you will still see diagnostics (red underlines) on your solidity imports. This is from your editor's LSP.  LSP (language server protocol) is a standard first created by VSCode that is now used by most editors including Vim, Neovim, Jetbrains, Sublime, and more.  Tevm supports solidity imports via a custom [typescript plugin](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin) called [tevm/ts-plugin](https://github.com/evmts/tevm-monorepo/tree/main/lsp).

Configuring the LSP is easy just simply `tevm/bundler/ts-plugin` to your tsconfig plugins

```json
{
  "compilerOptions": {
    "plugins": [{"name": "@tevm/bundler/ts-plugin"}]
  }
}
```

Tevm respects the `baseUrl` and `paths` property in the tsconfig.

If you configure your LSP and are still seeing issues importing solidity files you may need to configure your editor. Vim and Neovim should work out the box but VSCode users specifically will need to follow the below instructions.

## VSCode

If you are using vscode you will need to [configure typescript to use local version](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript)

1. Open command pallette and type in following

```
> Typescript: Select Typescript version
```

2. Then select workspace version
```
Use workspace version 5.x.x
```

## Foundry integration

Tevm always compiles contracts itself but it has the ability to read foundry remappings lib etc. if you set `foundry: true`. Doing this will require having foundry installed as it uses `foundry config --json` to read the foundry remappings and lib options.

Tevm is currently unable to resolve nested foundry projects such as installing a foundry project with NPM. Support for automatic foundry and hardhat project detection is planned for future.

## tevm.config.json

Tevm compiler offers some advanced configuration via the `tevm.config.json` file. This single configuration will be read by both your bundler and the typescript plugin. For configuration options see the [CompilerConfig reference docs](/reference/tevm/config/types/type-aliases/compilerconfig).

## 🚧 Typechecking

Language server plugins operate in your editor but not when doing command line typechecking. Command line typechecking similar to how `volar` based frameworks like `vue` or `svelte` do it is an important feature coming soon.

## Tevm cache

Tevm caches it's build artifacts to avoid wasted recompilations. The Tevm cache can be found in `.tevm` folder. It is a good resource for debugging when something goes wrong. Please add this folder to your git ignore.
