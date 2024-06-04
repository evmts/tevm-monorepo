[**@tevm/opstack**](../README.md) • **Docs**

***

[@tevm/opstack](../globals.md) / createL2OutputOracle

# Function: createL2OutputOracle()

> **createL2OutputOracle**(`chainId`): `Omit`\<`Script`\<`"L2OutputOracle"`, readonly [`"constructor()"`, `"function CHALLENGER() view returns (address)"`, `"function FINALIZATION_PERIOD_SECONDS() view returns (uint256)"`, `"function L2_BLOCK_TIME() view returns (uint256)"`, `"function PROPOSER() view returns (address)"`, `"function SUBMISSION_INTERVAL() view returns (uint256)"`, `"function challenger() view returns (address)"`, `"function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)"`, `"function deleteL2Outputs(uint256 _l2OutputIndex)"`, `"function finalizationPeriodSeconds() view returns (uint256)"`, `"function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)"`, `"function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)"`, `"function l2BlockTime() view returns (uint256)"`, `"function latestBlockNumber() view returns (uint256)"`, `"function latestOutputIndex() view returns (uint256)"`, `"function nextBlockNumber() view returns (uint256)"`, `"function nextOutputIndex() view returns (uint256)"`, `"function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable"`, `"function proposer() view returns (address)"`, `"function startingBlockNumber() view returns (uint256)"`, `"function startingTimestamp() view returns (uint256)"`, `"function submissionInterval() view returns (uint256)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)"`, `"event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

Creates a L2OutputOracle contract instance from a chainId
Currently only supports chainId 10

## Parameters

• **chainId**: `10`= `10`

## Returns

`Omit`\<`Script`\<`"L2OutputOracle"`, readonly [`"constructor()"`, `"function CHALLENGER() view returns (address)"`, `"function FINALIZATION_PERIOD_SECONDS() view returns (uint256)"`, `"function L2_BLOCK_TIME() view returns (uint256)"`, `"function PROPOSER() view returns (address)"`, `"function SUBMISSION_INTERVAL() view returns (uint256)"`, `"function challenger() view returns (address)"`, `"function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)"`, `"function deleteL2Outputs(uint256 _l2OutputIndex)"`, `"function finalizationPeriodSeconds() view returns (uint256)"`, `"function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))"`, `"function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)"`, `"function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)"`, `"function l2BlockTime() view returns (uint256)"`, `"function latestBlockNumber() view returns (uint256)"`, `"function latestOutputIndex() view returns (uint256)"`, `"function nextBlockNumber() view returns (uint256)"`, `"function nextOutputIndex() view returns (uint256)"`, `"function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable"`, `"function proposer() view returns (address)"`, `"function startingBlockNumber() view returns (uint256)"`, `"function startingTimestamp() view returns (uint256)"`, `"function submissionInterval() view returns (uint256)"`, `"function version() view returns (string)"`, `"event Initialized(uint8 version)"`, `"event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)"`, `"event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"`]\>, `"address"` \| `"events"` \| `"read"` \| `"write"`\> & `object`

## Example

```ts
import { createL2OutputOracle } from '@tevm/opstack'
const L2OutputOracle = createL2OutputOracle()
```

## Source

[experimental/opstack/src/contracts/l1/L2OutputOracle.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/experimental/opstack/src/contracts/l1/L2OutputOracle.ts#L13)
