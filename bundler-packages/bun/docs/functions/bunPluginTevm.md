[**@tevm/bun-plugin**](../README.md)

***

[@tevm/bun-plugin](../globals.md) / bunPluginTevm

# Function: bunPluginTevm()

> **bunPluginTevm**(`options`): `BunPlugin`

Defined in: bundler-packages/bun/src/bunPluginTevm.js:114

Creates a Bun plugin for Tevm that enables direct Solidity imports in JavaScript and TypeScript.

This plugin allows you to import Solidity contracts directly in your JavaScript/TypeScript code,
where they are automatically compiled and transformed into Tevm `Contract` instances with
fully typed interfaces. It integrates with the Bun build system to provide seamless handling
of .sol files.

## Parameters

### options

Plugin configuration options

#### solc?

`SolcVersions` = `defaultSolc.version`

Solidity compiler version to use

## Returns

`BunPlugin`

- A configured Bun plugin

## Example

#### Setup in a plugin.ts file
```typescript
// plugins.ts
import { bunPluginTevm } from '@tevm/bun'
import { plugin } from 'bun'

// Initialize with default options
plugin(bunPluginTevm({}))

// Or with a specific Solidity compiler version
plugin(bunPluginTevm({ solc: '0.8.20' }))
```

#### Configure in bunfig.toml
```toml
# bunfig.toml
preload = ["./plugins.ts"]
```

#### Configure TypeScript support in tsconfig.json
For editor integration with LSP (code completion, type checking):
```json
{
  "compilerOptions": {
    "plugins": [{ "name": "tevm/ts-plugin" }]
  }
}
```

#### Using imported Solidity contracts
```typescript
// Import Solidity contracts directly
import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol'
import { createMemoryClient } from 'tevm'

// Access contract metadata
console.log('ABI:', ERC20.abi)
console.log('Human-readable ABI:', ERC20.humanReadableAbi)
console.log('Bytecode:', ERC20.bytecode)

// Deploy and interact with the contract
const client = createMemoryClient()

// Deploy the contract
const deployed = await client.deployContract(ERC20)

// Call contract methods
const name = await deployed.read.name()
const tx = await deployed.write.transfer(
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  1000n
)
```

### How it works

Under the hood, the plugin processes Solidity files and generates JavaScript modules
that create Tevm Contract instances. For example, importing ERC20.sol results in code
like:

```typescript
import { createContract } from '@tevm/contract'

export const ERC20 = createContract({
  name: 'ERC20',
  humanReadableAbi: [ 'function balanceOf(address): uint256', ... ],
  bytecode: '0x...',
  deployedBytecode: '0x...',
})
```

### Custom Configuration

For custom configuration of the Tevm compiler, add a `tevm.config.json` file
to your project root:

```json
{
  "foundryProject": true,       // Is this a Foundry project? (or path to project)
  "libs": ["lib"],              // Library directories
  "remappings": {               // Import remappings (like in Foundry)
    "foo": "vendored/foo"
  },
  "debug": true,                // Enable debug logging
  "cacheDir": ".tevm"           // Cache directory for compiled contracts
}
```

## Throws

If there's an issue loading or processing Solidity files

## See

[Tevm Solidity Import Documentation](https://tevm.sh/learn/solidity-imports/)
