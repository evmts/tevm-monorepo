[**@tevm/opstack**](../README.md) • **Docs**

***

[@tevm/opstack](../globals.md) / createProtocolVersions

# Function: createProtocolVersions()

> **createProtocolVersions**(`chainId`): `Omit`\<`Script`\<`"ProtocolVersions"`, readonly [`"constructor()"`, `"function RECOMMENDED_SLOT() view returns (bytes32)"`, `"function REQUIRED_SLOT() view returns (bytes32)"`, `"function VERSION() view returns (uint256)"`, `"function initialize(address _owner, uint256 _required, uint256 _recommended)"`, `"function owner() view returns (address)"`, `"function recommended() view returns (uint256 out_)"`, `"function renounceOwnership()"`, `"function required() view returns (uint256 out_)"`, `"function setRecommended(uint256 _recommended)"`, `"function setRequired(uint256 _required)"`, `"function transferOwnership(address newOwner)"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

Creates a ProtocolVersions contract instance from a chainId
Currently only supports chainId 10

## Parameters

• **chainId**: `10`= `10`

## Returns

`Omit`\<`Script`\<`"ProtocolVersions"`, readonly [`"constructor()"`, `"function RECOMMENDED_SLOT() view returns (bytes32)"`, `"function REQUIRED_SLOT() view returns (bytes32)"`, `"function VERSION() view returns (uint256)"`, `"function initialize(address _owner, uint256 _required, uint256 _recommended)"`, `"function owner() view returns (address)"`, `"function recommended() view returns (uint256 out_)"`, `"function renounceOwnership()"`, `"function required() view returns (uint256 out_)"`, `"function setRecommended(uint256 _recommended)"`, `"function setRequired(uint256 _required)"`, `"function transferOwnership(address newOwner)"`, `"function version() view returns (string)"`, `"event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

## Example

```ts
import { createProtocolVersions } from '@tevm/opstack'
const ProtocolVersions = createProtocolVersions()
```

## Source

[experimental/opstack/src/contracts/l1/ProtocolVersions.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/experimental/opstack/src/contracts/l1/ProtocolVersions.ts#L13)
