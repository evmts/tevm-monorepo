/**
 * Creates a SuperchainConfig contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createSuperchainConfig } from '@tevm/opstack'
 * const SuperchainConfig = createSuperchainConfig()
 */
export declare const createSuperchainConfig: (chainId?: 10) => Omit<import("@tevm/contract").Script<"SuperchainConfig", readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"]>, "address" | "events" | "read" | "write"> & {
    address: "0x6902690269026902690269026902690269026902";
    events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"], `0x${string}`, `0x${string}`, "0x6902690269026902690269026902690269026902">;
    read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"], `0x${string}`, `0x${string}`, "0x6902690269026902690269026902690269026902">;
    write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"], `0x${string}`, `0x${string}`, "0x6902690269026902690269026902690269026902">;
};
export declare const SuperchainConfigAddresses: {
    readonly '10': "0x6902690269026902690269026902690269026902";
};
export declare const SuperchainConfigBytecode: `0x${string}`;
export declare const SuperchainConfigDeployedBytecode: `0x${string}`;
export declare const SuperchainConfigHumanReadableAbi: readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"];
export declare const SuperchainConfigAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "GUARDIAN_SLOT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "PAUSED_SLOT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "guardian";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "guardian_";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_guardian";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_paused";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "pause";
    readonly inputs: readonly [{
        readonly name: "_identifier";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
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
    readonly name: "unpause";
    readonly inputs: readonly [];
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
        readonly name: "updateType";
        readonly type: "uint8";
        readonly indexed: true;
        readonly internalType: "enum SuperchainConfig.UpdateType";
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
    readonly name: "Paused";
    readonly inputs: readonly [{
        readonly name: "identifier";
        readonly type: "string";
        readonly indexed: false;
        readonly internalType: "string";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Unpaused";
    readonly inputs: readonly [];
    readonly anonymous: false;
}];
//# sourceMappingURL=SuperchainConfig.d.ts.map