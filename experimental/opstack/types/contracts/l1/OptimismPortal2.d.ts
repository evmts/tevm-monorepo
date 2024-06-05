/**
 * Creates a OptimismPortal2 contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createOptimismPortal2 } from '@tevm/opstack'
 * const OptimismPortal2 = createOptimismPortal2()
 */
export declare const createOptimismPortal2: (chainId?: 10) => Omit<import("@tevm/contract").Script<"OptimismPortal2", readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"]>, "address" | "events" | "read" | "write"> & {
    address: "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed";
    events: import("@tevm/contract").EventActionCreator<readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"], `0x${string}`, `0x${string}`, "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed">;
    read: import("@tevm/contract").ReadActionCreator<readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"], `0x${string}`, `0x${string}`, "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed">;
    write: import("@tevm/contract").WriteActionCreator<readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"], `0x${string}`, `0x${string}`, "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed">;
};
export declare const OptimismPortal2Addresses: {
    readonly '10': "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed";
};
export declare const OptimismPortal2Bytecode: `0x${string}`;
export declare const OptimismPortal2DeployedBytecode: `0x${string}`;
export declare const OptimismPortal2HumanReadableAbi: readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"];
export declare const OptimismPortal2Abi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_proofMaturityDelaySeconds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_disputeGameFinalityDelaySeconds";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_initialRespectedGameType";
        readonly type: "uint32";
        readonly internalType: "GameType";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "GUARDIAN";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "SYSTEM_CONFIG";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract SystemConfig";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "blacklistDisputeGame";
    readonly inputs: readonly [{
        readonly name: "_disputeGame";
        readonly type: "address";
        readonly internalType: "contract IDisputeGame";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "checkWithdrawal";
    readonly inputs: readonly [{
        readonly name: "_withdrawalHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "deleteProvenWithdrawal";
    readonly inputs: readonly [{
        readonly name: "_withdrawalHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "depositTransaction";
    readonly inputs: readonly [{
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_value";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_gasLimit";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }, {
        readonly name: "_isCreation";
        readonly type: "bool";
        readonly internalType: "bool";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "disputeGameBlacklist";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDisputeGame";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "disputeGameFactory";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract DisputeGameFactory";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "donateETH";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "finalizeWithdrawalTransaction";
    readonly inputs: readonly [{
        readonly name: "_tx";
        readonly type: "tuple";
        readonly internalType: "struct Types.WithdrawalTransaction";
        readonly components: readonly [{
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasLimit";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "data";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "finalizedWithdrawals";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "guardian";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_disputeGameFactory";
        readonly type: "address";
        readonly internalType: "contract DisputeGameFactory";
    }, {
        readonly name: "_systemConfig";
        readonly type: "address";
        readonly internalType: "contract SystemConfig";
    }, {
        readonly name: "_superchainConfig";
        readonly type: "address";
        readonly internalType: "contract SuperchainConfig";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "l2Sender";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "minimumGasLimit";
    readonly inputs: readonly [{
        readonly name: "_byteCount";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "pure";
}, {
    readonly type: "function";
    readonly name: "params";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "prevBaseFee";
        readonly type: "uint128";
        readonly internalType: "uint128";
    }, {
        readonly name: "prevBoughtGas";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }, {
        readonly name: "prevBlockNum";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "paused";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "paused_";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "proveWithdrawalTransaction";
    readonly inputs: readonly [{
        readonly name: "_tx";
        readonly type: "tuple";
        readonly internalType: "struct Types.WithdrawalTransaction";
        readonly components: readonly [{
            readonly name: "nonce";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "sender";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "target";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "value";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "gasLimit";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "data";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }, {
        readonly name: "_disputeGameIndex";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_outputRootProof";
        readonly type: "tuple";
        readonly internalType: "struct Types.OutputRootProof";
        readonly components: readonly [{
            readonly name: "version";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "stateRoot";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "messagePasserStorageRoot";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }, {
            readonly name: "latestBlockhash";
            readonly type: "bytes32";
            readonly internalType: "bytes32";
        }];
    }, {
        readonly name: "_withdrawalProof";
        readonly type: "bytes[]";
        readonly internalType: "bytes[]";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "provenWithdrawals";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "disputeGameProxy";
        readonly type: "address";
        readonly internalType: "contract IDisputeGame";
    }, {
        readonly name: "timestamp";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "respectedGameType";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint32";
        readonly internalType: "GameType";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "setRespectedGameType";
    readonly inputs: readonly [{
        readonly name: "_gameType";
        readonly type: "uint32";
        readonly internalType: "GameType";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "superchainConfig";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract SuperchainConfig";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "systemConfig";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract SystemConfig";
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
    readonly name: "TransactionDeposited";
    readonly inputs: readonly [{
        readonly name: "from";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "version";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "opaqueData";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "WithdrawalFinalized";
    readonly inputs: readonly [{
        readonly name: "withdrawalHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "success";
        readonly type: "bool";
        readonly indexed: false;
        readonly internalType: "bool";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "WithdrawalProven";
    readonly inputs: readonly [{
        readonly name: "withdrawalHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}];
//# sourceMappingURL=OptimismPortal2.d.ts.map