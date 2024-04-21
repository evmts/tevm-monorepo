**@tevm/opstack** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > createOptimismPortal2

# Function: createOptimismPortal2()

> **createOptimismPortal2**(`chainId`): `Omit`\<`Script`\<`"OptimismPortal2"`, readonly [`"constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)"`, `"receive() external payable"`, `"function GUARDIAN() view returns (address)"`, `"function SYSTEM_CONFIG() view returns (address)"`, `"function blacklistDisputeGame(address _disputeGame)"`, `"function checkWithdrawal(bytes32 _withdrawalHash) view"`, `"function deleteProvenWithdrawal(bytes32 _withdrawalHash)"`, `"function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable"`, `"function disputeGameBlacklist(address) view returns (bool)"`, `"function disputeGameFactory() view returns (address)"`, `"function donateETH() payable"`, `"function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)"`, `"function finalizedWithdrawals(bytes32) view returns (bool)"`, `"function guardian() view returns (address)"`, `"function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)"`, `"function l2Sender() view returns (address)"`, `"function minimumGasLimit(uint64 _byteCount) pure returns (uint64)"`, `"function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)"`, `"function paused() view returns (bool paused_)"`, `"function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)"`, `"function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)"`, `"function respectedGameType() view returns (uint32)"`, `"function setRespectedGameType(uint32 _gameType)"`, `"function superchainConfig() view returns (address)"`, `"function systemConfig() view returns (address)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)"`, `"event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)"`, `"event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

Creates a OptimismPortal2 contract instance from a chainId
Currently only supports chainId 10

## Parameters

▪ **chainId**: `10`= `10`

## Returns

## Example

```ts
import { createOptimismPortal2 } from '@tevm/opstack'
const OptimismPortal2 = createOptimismPortal2()
```

## Source

[extensions/opstack/src/contracts/l1/OptimismPortal2.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/extensions/opstack/src/contracts/l1/OptimismPortal2.ts#L13)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
