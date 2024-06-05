/**
 * Creates a SystemConfig contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createSystemConfig } from '@tevm/opstack'
 * const SystemConfig = createSystemConfig()
 */
export declare const createSystemConfig: (chainId?: 10) => Omit<import("@tevm/contract").Script<"SystemConfig", readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290";
    events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290">;
    read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290">;
    write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290">;
};
export declare const SystemConfigAddresses: {
    readonly '10': "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290";
};
export declare const SystemConfigBytecode: `0x${string}`;
export declare const SystemConfigDeployedBytecode: `0x${string}`;
export declare const SystemConfigHumanReadableAbi: readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"];
export declare const SystemConfigAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "BATCH_INBOX_SLOT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "L1_CROSS_DOMAIN_MESSENGER_SLOT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "L1_ERC_721_BRIDGE_SLOT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "L1_STANDARD_BRIDGE_SLOT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "L2_OUTPUT_ORACLE_SLOT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "OPTIMISM_PORTAL_SLOT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "START_BLOCK_SLOT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "UNSAFE_BLOCK_SIGNER_SLOT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "batchInbox";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "addr_";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "batcherHash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "gasLimit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_overhead";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_scalar";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_batcherHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_gasLimit";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }, {
        readonly name: "_unsafeBlockSigner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_config";
        readonly type: "tuple";
        readonly internalType: "struct ResourceMetering.ResourceConfig";
        readonly components: readonly [{
            readonly name: "maxResourceLimit";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "elasticityMultiplier";
            readonly type: "uint8";
            readonly internalType: "uint8";
        }, {
            readonly name: "baseFeeMaxChangeDenominator";
            readonly type: "uint8";
            readonly internalType: "uint8";
        }, {
            readonly name: "minimumBaseFee";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "systemTxMaxGas";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "maximumBaseFee";
            readonly type: "uint128";
            readonly internalType: "uint128";
        }];
    }, {
        readonly name: "_batchInbox";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_addresses";
        readonly type: "tuple";
        readonly internalType: "struct SystemConfig.Addresses";
        readonly components: readonly [{
            readonly name: "l1CrossDomainMessenger";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "l1ERC721Bridge";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "l1StandardBridge";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "l2OutputOracle";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "optimismPortal";
            readonly type: "address";
            readonly internalType: "address";
        }, {
            readonly name: "optimismMintableERC20Factory";
            readonly type: "address";
            readonly internalType: "address";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "l1CrossDomainMessenger";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "addr_";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "l1ERC721Bridge";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "addr_";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "l1StandardBridge";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "addr_";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "l2OutputOracle";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "addr_";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "minimumGasLimit";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optimismMintableERC20Factory";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "addr_";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "optimismPortal";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "addr_";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "overhead";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "owner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "renounceOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "resourceConfig";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "tuple";
        readonly internalType: "struct ResourceMetering.ResourceConfig";
        readonly components: readonly [{
            readonly name: "maxResourceLimit";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "elasticityMultiplier";
            readonly type: "uint8";
            readonly internalType: "uint8";
        }, {
            readonly name: "baseFeeMaxChangeDenominator";
            readonly type: "uint8";
            readonly internalType: "uint8";
        }, {
            readonly name: "minimumBaseFee";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "systemTxMaxGas";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "maximumBaseFee";
            readonly type: "uint128";
            readonly internalType: "uint128";
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "scalar";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "setBatcherHash";
    readonly inputs: readonly [{
        readonly name: "_batcherHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "setGasConfig";
    readonly inputs: readonly [{
        readonly name: "_overhead";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_scalar";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "setGasLimit";
    readonly inputs: readonly [{
        readonly name: "_gasLimit";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "setResourceConfig";
    readonly inputs: readonly [{
        readonly name: "_config";
        readonly type: "tuple";
        readonly internalType: "struct ResourceMetering.ResourceConfig";
        readonly components: readonly [{
            readonly name: "maxResourceLimit";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "elasticityMultiplier";
            readonly type: "uint8";
            readonly internalType: "uint8";
        }, {
            readonly name: "baseFeeMaxChangeDenominator";
            readonly type: "uint8";
            readonly internalType: "uint8";
        }, {
            readonly name: "minimumBaseFee";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "systemTxMaxGas";
            readonly type: "uint32";
            readonly internalType: "uint32";
        }, {
            readonly name: "maximumBaseFee";
            readonly type: "uint128";
            readonly internalType: "uint128";
        }];
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "setUnsafeBlockSigner";
    readonly inputs: readonly [{
        readonly name: "_unsafeBlockSigner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "startBlock";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "startBlock_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "transferOwnership";
    readonly inputs: readonly [{
        readonly name: "newOwner";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "unsafeBlockSigner";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "addr_";
        readonly type: "address";
        readonly internalType: "address";
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
    readonly name: "ConfigUpdate";
    readonly inputs: readonly [{
        readonly name: "version";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "updateType";
        readonly type: "uint8";
        readonly indexed: true;
        readonly internalType: "enum SystemConfig.UpdateType";
    }, {
        readonly name: "data";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
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
    readonly name: "OwnershipTransferred";
    readonly inputs: readonly [{
        readonly name: "previousOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}];
//# sourceMappingURL=SystemConfig.d.ts.map