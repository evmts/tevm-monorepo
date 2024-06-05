/**
 * Creates a ProtocolVersions contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createProtocolVersions } from '@tevm/opstack'
 * const ProtocolVersions = createProtocolVersions()
 */
export declare const createProtocolVersions: (chainId?: 10) => Omit<import("@tevm/contract").Script<"ProtocolVersions", readonly ["constructor()", "function RECOMMENDED_SLOT() view returns (bytes32)", "function REQUIRED_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function initialize(address _owner, uint256 _required, uint256 _recommended)", "function owner() view returns (address)", "function recommended() view returns (uint256 out_)", "function renounceOwnership()", "function required() view returns (uint256 out_)", "function setRecommended(uint256 _recommended)", "function setRequired(uint256 _required)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x6903690369036903690369036903690369036903";
    events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "function RECOMMENDED_SLOT() view returns (bytes32)", "function REQUIRED_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function initialize(address _owner, uint256 _required, uint256 _recommended)", "function owner() view returns (address)", "function recommended() view returns (uint256 out_)", "function renounceOwnership()", "function required() view returns (uint256 out_)", "function setRecommended(uint256 _recommended)", "function setRequired(uint256 _required)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x6903690369036903690369036903690369036903">;
    read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "function RECOMMENDED_SLOT() view returns (bytes32)", "function REQUIRED_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function initialize(address _owner, uint256 _required, uint256 _recommended)", "function owner() view returns (address)", "function recommended() view returns (uint256 out_)", "function renounceOwnership()", "function required() view returns (uint256 out_)", "function setRecommended(uint256 _recommended)", "function setRequired(uint256 _required)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x6903690369036903690369036903690369036903">;
    write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "function RECOMMENDED_SLOT() view returns (bytes32)", "function REQUIRED_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function initialize(address _owner, uint256 _required, uint256 _recommended)", "function owner() view returns (address)", "function recommended() view returns (uint256 out_)", "function renounceOwnership()", "function required() view returns (uint256 out_)", "function setRecommended(uint256 _recommended)", "function setRequired(uint256 _required)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x6903690369036903690369036903690369036903">;
};
export declare const ProtocolVersionsAddresses: {
    readonly '10': "0x6903690369036903690369036903690369036903";
};
export declare const ProtocolVersionsBytecode: `0x${string}`;
export declare const ProtocolVersionsDeployedBytecode: `0x${string}`;
export declare const ProtocolVersionsHumanReadableAbi: readonly ["constructor()", "function RECOMMENDED_SLOT() view returns (bytes32)", "function REQUIRED_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function initialize(address _owner, uint256 _required, uint256 _recommended)", "function owner() view returns (address)", "function recommended() view returns (uint256 out_)", "function renounceOwnership()", "function required() view returns (uint256 out_)", "function setRecommended(uint256 _recommended)", "function setRequired(uint256 _required)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"];
export declare const ProtocolVersionsAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "RECOMMENDED_SLOT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "REQUIRED_SLOT";
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
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_required";
        readonly type: "uint256";
        readonly internalType: "ProtocolVersion";
    }, {
        readonly name: "_recommended";
        readonly type: "uint256";
        readonly internalType: "ProtocolVersion";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
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
    readonly name: "recommended";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "out_";
        readonly type: "uint256";
        readonly internalType: "ProtocolVersion";
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
    readonly name: "required";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "out_";
        readonly type: "uint256";
        readonly internalType: "ProtocolVersion";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "setRecommended";
    readonly inputs: readonly [{
        readonly name: "_recommended";
        readonly type: "uint256";
        readonly internalType: "ProtocolVersion";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "setRequired";
    readonly inputs: readonly [{
        readonly name: "_required";
        readonly type: "uint256";
        readonly internalType: "ProtocolVersion";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
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
        readonly internalType: "enum ProtocolVersions.UpdateType";
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
//# sourceMappingURL=ProtocolVersions.d.ts.map