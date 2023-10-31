[@evmts/blockexplorer](README.md) / Exports

# @evmts/blockexplorer

## Table of contents

### Classes

- [SafeStandardBlockExplorer](undefined)
- [StandardBlockExplorer](undefined)

### Interfaces

- [BlockExplorerOptions](undefined)

### Type Aliases

- [Address](undefined)
- [Hex](undefined)

## Classes

### SafeStandardBlockExplorer

• **SafeStandardBlockExplorer**: Class SafeStandardBlockExplorer

Utility for interacting with a block explorer via [Effect.ts](

Initiate with any compliant block explorer for utils like generating the url for a transaction, block, or address.

**`Example`**

```ts
import { Effect } from 'effect'
const etherscan = new SafeStandardBlockExplorer(
  name: 'Etherscan',
  url: 'https://etherscan.io',
  chainId: 1,
)
const txUrlEffect = etherscan.getTxUrl('0x1234')
````

#### Defined in

[blockExplorer.js:39](https://github.com/evmts/evmts-monorepo/blob/main/packages/blockexplorer/src/blockExplorer.js#L39)

___

### StandardBlockExplorer

• **StandardBlockExplorer**: Class StandardBlockExplorer

Type of utility for interacting with a block explorer

Initiate with any compliant block explorer for utils like generating the url for a transaction, block, or address.

**`Example`**

```ts
const etherscan: BlockExplorer = new StandardBlockExplorer(
  name: 'Etherscan',
  url: 'https://etherscan.io',
  chainId: 1,
)
const txUrl = etherscan.getTxUrl('0x1234')
```

#### Defined in

[blockExplorer.js:155](https://github.com/evmts/evmts-monorepo/blob/main/packages/blockexplorer/src/blockExplorer.js#L155)

## Interfaces

### BlockExplorerOptions

• **BlockExplorerOptions**: Interface BlockExplorerOptions<\>

#### Defined in

[blockExplorer.js:18](https://github.com/evmts/evmts-monorepo/blob/main/packages/blockexplorer/src/blockExplorer.js#L18)

## Type Aliases

### Address

Ƭ **Address**: \`0x${string}\`

#### Defined in

[blockExplorer.js:14](https://github.com/evmts/evmts-monorepo/blob/main/packages/blockexplorer/src/blockExplorer.js#L14)

___

### Hex

Ƭ **Hex**: \`0x${string}\`

#### Defined in

[blockExplorer.js:13](https://github.com/evmts/evmts-monorepo/blob/main/packages/blockexplorer/src/blockExplorer.js#L13)
