/**
 * Creates a L2OutputOracle contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL2OutputOracle } from '@tevm/opstack'
 * const L2OutputOracle = createL2OutputOracle()
 */
export declare const createL2OutputOracle: (chainId?: 10) => Omit<import("@tevm/contract").Script<"L2OutputOracle", readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"]>, "address" | "events" | "read" | "write"> & {
    address: "0xdfe97868233d1aa22e815a266982f2cf17685a27";
    events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"], `0x${string}`, `0x${string}`, "0xdfe97868233d1aa22e815a266982f2cf17685a27">;
    read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"], `0x${string}`, `0x${string}`, "0xdfe97868233d1aa22e815a266982f2cf17685a27">;
    write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"], `0x${string}`, `0x${string}`, "0xdfe97868233d1aa22e815a266982f2cf17685a27">;
};
export declare const L2OutputOracleAddresses: {
    readonly '10': "0xdfe97868233d1aa22e815a266982f2cf17685a27";
};
export declare const L2OutputOracleBytecode: `0x${string}`;
export declare const L2OutputOracleDeployedBytecode: `0x${string}`;
export declare const L2OutputOracleHumanReadableAbi: readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"];
export declare const L2OutputOracleAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "CHALLENGER";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "FINALIZATION_PERIOD_SECONDS";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "L2_BLOCK_TIME";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PROPOSER";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "SUBMISSION_INTERVAL";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "challenger";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "computeL2Timestamp";
    readonly inputs: readonly [{
        readonly name: "_l2BlockNumber";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "deleteL2Outputs";
    readonly inputs: readonly [{
        readonly name: "_l2OutputIndex";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "finalizationPeriodSeconds";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getL2Output";
    readonly inputs: readonly [{
        readonly name: "_l2OutputIndex";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "tuple";
        readonly internalType: "struct Types.OutputProposal";
        readonly components: readonly [{
            readonly name: "outputRoot";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "timestamp";
            readonly type: "uint128";
            readonly internalType: "uint128";
        }, {
            readonly name: "l2BlockNumber";
            readonly type: "uint128";
            readonly internalType: "uint128";
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getL2OutputAfter";
    readonly inputs: readonly [{
        readonly name: "_l2BlockNumber";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "tuple";
        readonly internalType: "struct Types.OutputProposal";
        readonly components: readonly [{
            readonly name: "outputRoot";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "timestamp";
            readonly type: "uint128";
            readonly internalType: "uint128";
        }, {
            readonly name: "l2BlockNumber";
            readonly type: "uint128";
            readonly internalType: "uint128";
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getL2OutputIndexAfter";
    readonly inputs: readonly [{
        readonly name: "_l2BlockNumber";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_submissionInterval";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_l2BlockTime";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_startingBlockNumber";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_startingTimestamp";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_proposer";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_challenger";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_finalizationPeriodSeconds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "l2BlockTime";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "latestBlockNumber";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "latestOutputIndex";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "nextBlockNumber";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "nextOutputIndex";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proposeL2Output";
    readonly inputs: readonly [{
        readonly name: "_outputRoot";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_l2BlockNumber";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_l1BlockHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_l1BlockNumber";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "proposer";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "startingBlockNumber";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "startingTimestamp";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "submissionInterval";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "version";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "event";
    readonly name: "Initialized";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "uint8";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OutputProposed";
    readonly inputs: readonly [{
        readonly name: "outputRoot";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "l2OutputIndex";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "l2BlockNumber";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "l1Timestamp";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "OutputsDeleted";
    readonly inputs: readonly [{
        readonly name: "prevNextOutputIndex";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "newNextOutputIndex";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}];
//# sourceMappingURL=L2OutputOracle.d.ts.map