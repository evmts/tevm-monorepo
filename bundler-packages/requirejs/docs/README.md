**@tevm/requirejs-plugin**

***

# @tevm/requirejs-plugin

A RequireJS loader plugin for importing Solidity files directly in JavaScript and TypeScript.

## Installation

```bash
pnpm i @tevm/requirejs-plugin
```

## Usage

### Basic Setup

Configure RequireJS to use the Tevm plugin:

```javascript
// Configure RequireJS paths
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

### Using with Tevm Client

```javascript
require([
  'tevm-sol!@openzeppelin/contracts/token/ERC20/ERC20.sol',
  'tevm'
], function(ERC20, tevm) {
  const client = tevm.createMemoryClient();

  // Deploy the contract
  client.deployContract(ERC20, ["My Token", "MTK"])
    .then(deployed => deployed.read.name())
    .then(name => console.log('Token name:', name));
});
```

### TypeScript Support

For full TypeScript support including editor integration, add the Tevm TypeScript plugin to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "plugins": [{ "name": "tevm/ts-plugin" }]
  }
}
```

### Custom Configuration

For custom Tevm compiler configuration, add a `tevm.config.json` file to your project root:

```json
{
  "foundryProject": true,
  "libs": ["lib"],
  "remappings": {
    "foo": "vendored/foo"
  },
  "debug": true,
  "cacheDir": ".tevm"
}
```

## How It Works

The plugin transforms Solidity imports into JavaScript modules. For example, loading `ERC20.sol` generates code like:

```javascript
define(['@tevm/contract'], function(tevmContract) {
  return tevmContract.createContract({
    name: 'ERC20',
    humanReadableAbi: [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      // ... other functions
    ],
    bytecode: '0x...',
    deployedBytecode: '0x...',
  });
});
```

## Features

- ✅ Direct Solidity imports in JavaScript/TypeScript
- ✅ Full type safety with TypeScript plugin
- ✅ Automatic compilation and caching
- ✅ Support for Foundry projects
- ✅ Works with npm packages like OpenZeppelin

## See Also

- [Documentation](./docs/)
- [Tevm Documentation](https://tevm.sh)

## License 📄

<a href="_media/LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
