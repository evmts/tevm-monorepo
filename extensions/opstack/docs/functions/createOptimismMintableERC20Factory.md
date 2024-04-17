**@tevm/opstack** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/opstack](../README.md) / createOptimismMintableERC20Factory

# Function: createOptimismMintableERC20Factory()

> **createOptimismMintableERC20Factory**(`chainId`): `Omit`\<`Script`\<`"OptimismMintableERC20Factory"`, readonly [`"constructor()"`, `"function BRIDGE() view returns (address)"`, `"function bridge() view returns (address)"`, `"function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)"`, `"function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function initialize(address _bridge)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)"`, `"event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

Creates a OptimismMintableERC20Factory contract instance from a chainId
Currently only supports chainId 10

## Parameters

• **chainId**: `10`= `10`

## Returns

`Omit`\<`Script`\<`"OptimismMintableERC20Factory"`, readonly [`"constructor()"`, `"function BRIDGE() view returns (address)"`, `"function bridge() view returns (address)"`, `"function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)"`, `"function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)"`, `"function initialize(address _bridge)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)"`, `"event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

## Example

```ts
import { createOptimismMintableERC20Factory } from '@tevm/opstack'
const OptimismMintableERC20Factory = createOptimismMintableERC20Factory()
```

## Source

[extensions/opstack/src/contracts/l1/OptimismMintableERC20Factory.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/extensions/opstack/src/contracts/l1/OptimismMintableERC20Factory.ts#L13)
