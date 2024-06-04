[**@tevm/opstack**](../README.md) • **Docs**

***

[@tevm/opstack](../globals.md) / createDisputeGameFactory

# Function: createDisputeGameFactory()

> **createDisputeGameFactory**(`chainId`): `Omit`\<`Script`\<`"DisputeGameFactory"`, readonly [`"constructor()"`, `"function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)"`, `"function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)"`, `"function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)"`, `"function gameCount() view returns (uint256 gameCount_)"`, `"function gameImpls(uint32) view returns (address)"`, `"function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)"`, `"function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)"`, `"function initBonds(uint32) view returns (uint256)"`, `"function initialize(address _owner)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function setImplementation(uint32 _gameType, address _impl)"`, `"function setInitBond(uint32 _gameType, uint256 _initBond)"`, `"function transferOwnership(address newOwner)"`, `"function version() view returns (string)"`, `"event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)"`, `"event ImplementationSet(address indexed impl, uint32 indexed gameType)"`, `"event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`, `"error GameAlreadyExists(bytes32 uuid)"`, `"error InsufficientBond()"`, `"error NoImplementation(uint32 gameType)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

Creates a DisputeGameFactory contract instance from a chainId
Currently only supports chainId 10

## Parameters

• **chainId**: `10`= `10`

## Returns

`Omit`\<`Script`\<`"DisputeGameFactory"`, readonly [`"constructor()"`, `"function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)"`, `"function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)"`, `"function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)"`, `"function gameCount() view returns (uint256 gameCount_)"`, `"function gameImpls(uint32) view returns (address)"`, `"function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)"`, `"function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)"`, `"function initBonds(uint32) view returns (uint256)"`, `"function initialize(address _owner)"`, `"function owner() view returns (address)"`, `"function renounceOwnership()"`, `"function setImplementation(uint32 _gameType, address _impl)"`, `"function setInitBond(uint32 _gameType, uint256 _initBond)"`, `"function transferOwnership(address newOwner)"`, `"function version() view returns (string)"`, `"event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)"`, `"event ImplementationSet(address indexed impl, uint32 indexed gameType)"`, `"event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)"`, `"event Initialized(uint8 version)"`, `"event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"`, `"error GameAlreadyExists(bytes32 uuid)"`, `"error InsufficientBond()"`, `"error NoImplementation(uint32 gameType)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

## Example

```ts
import { createDisputeGameFactory } from '@tevm/opstack'
const DisputeGameFactory = createDisputeGameFactory()
```

## Source

[experimental/opstack/src/contracts/l1/DisputeGameFactory.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/experimental/opstack/src/contracts/l1/DisputeGameFactory.ts#L13)
