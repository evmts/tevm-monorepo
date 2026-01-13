[**@tevm/requirejs-plugin**](../README.md)

***

[@tevm/requirejs-plugin](../globals.md) / requirejsPluginTevm

# Function: requirejsPluginTevm()

> **requirejsPluginTevm**(`options?`): `Object`

Defined in: [requirejsPluginTevm.js:109](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/requirejs/src/requirejsPluginTevm.js#L109)

RequireJS loader plugin for Tevm that enables direct Solidity imports in JavaScript and TypeScript.

This plugin allows you to load Solidity contracts as RequireJS modules, where they are automatically
compiled and transformed into Tevm `Contract` instances with fully typed interfaces. It integrates
with the RequireJS loader system to provide seamless handling of .sol files.

The plugin implements the RequireJS loader plugin API with `load` and `normalize` methods.

## Parameters

### options?

Plugin configuration options

#### solc?

`SolcVersions` = `defaultSolc.version`

Solidity compiler version to use

## Returns

`Object`

A RequireJS loader plugin with load and normalize methods

## Examples

#### Setup in RequireJS configuration
```javascript
// Configure RequireJS
requirejs.config({
  paths: {
    'tevm-sol': 'node_modules/@tevm/requirejs-plugin/dist/requirejsPluginTevm'
  }
});

// Load a Solidity contract
define(['tevm-sol!./contracts/Counter.sol'], function(Counter) {
  console.log('ABI:', Counter.abi);
  console.log('Bytecode:', Counter.bytecode);
});
```

#### With specific compiler version
```javascript
// In your build config or preload script
import { requirejsPluginTevm } from '@tevm/requirejs'

// Create plugin with specific solc version
const plugin = requirejsPluginTevm({ solc: '0.8.20' })

// Register with RequireJS
define('tevm-sol', [], function() { return plugin })
```

#### Using imported Solidity contracts
```javascript
// Load contracts with RequireJS
require(['tevm-sol!@openzeppelin/contracts/token/ERC20/ERC20.sol', 'tevm'],
  function(ERC20, tevm) {
    const client = tevm.createMemoryClient()

    // Deploy the contract
    client.deployContract(ERC20, ["My Token", "MTK"]).then(deployed => {
      // Interact with the contract
      return deployed.read.name()
    }).then(name => {
      console.log('Token name:', name)
    })
  }
)
```

### How it works

Under the hood, the plugin processes Solidity files and generates JavaScript modules
that create Tevm Contract instances. For example, loading ERC20.sol results in code like:

```javascript
define(['@tevm/contract'], function(tevmContract) {
  return tevmContract.createContract({
    name: 'ERC20',
    humanReadableAbi: [ 'function balanceOf(address): uint256', ... ],
    bytecode: '0x...',
    deployedBytecode: '0x...',
  })
})
```

### Custom Configuration

For custom configuration of the Tevm compiler, add a `tevm.config.json` file
to your project root:

```json
{
  "foundryProject": true,       // Is this a Foundry project?
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

 - [RequireJS Loader Plugin API](https://requirejs.org/docs/plugins.html)
 - [Tevm Solidity Import Documentation](https://tevm.sh/learn/solidity-imports/)
