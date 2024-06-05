/**
 * Creates a DelayedVetoable contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createDelayedVetoable } from '@tevm/opstack'
 * const DelayedVetoable = createDelayedVetoable()
 */
export declare const createDelayedVetoable: (chainId?: 10) => Omit<import("@tevm/contract").Script<"DelayedVetoable", readonly ["constructor(address vetoer_, address initiator_, address target_, uint256 operatingDelay_)", "fallback()", "function delay() returns (uint256 delay_)", "function initiator() returns (address initiator_)", "function queuedAt(bytes32 callHash) returns (uint256 queuedAt_)", "function target() returns (address target_)", "function version() view returns (string)", "function vetoer() returns (address vetoer_)", "event DelayActivated(uint256 delay)", "event Forwarded(bytes32 indexed callHash, bytes data)", "event Initiated(bytes32 indexed callHash, bytes data)", "event Vetoed(bytes32 indexed callHash, bytes data)", "error AlreadyDelayed()", "error ForwardingEarly()", "error TargetUnitialized()", "error Unauthorized(address expected, address actual)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x6900690069006900690069006900690069006900";
    events: import("@tevm/contract").EventActionCreator<readonly ["constructor(address vetoer_, address initiator_, address target_, uint256 operatingDelay_)", "fallback()", "function delay() returns (uint256 delay_)", "function initiator() returns (address initiator_)", "function queuedAt(bytes32 callHash) returns (uint256 queuedAt_)", "function target() returns (address target_)", "function version() view returns (string)", "function vetoer() returns (address vetoer_)", "event DelayActivated(uint256 delay)", "event Forwarded(bytes32 indexed callHash, bytes data)", "event Initiated(bytes32 indexed callHash, bytes data)", "event Vetoed(bytes32 indexed callHash, bytes data)", "error AlreadyDelayed()", "error ForwardingEarly()", "error TargetUnitialized()", "error Unauthorized(address expected, address actual)"], `0x${string}`, `0x${string}`, "0x6900690069006900690069006900690069006900">;
    read: import("@tevm/contract").ReadActionCreator<readonly ["constructor(address vetoer_, address initiator_, address target_, uint256 operatingDelay_)", "fallback()", "function delay() returns (uint256 delay_)", "function initiator() returns (address initiator_)", "function queuedAt(bytes32 callHash) returns (uint256 queuedAt_)", "function target() returns (address target_)", "function version() view returns (string)", "function vetoer() returns (address vetoer_)", "event DelayActivated(uint256 delay)", "event Forwarded(bytes32 indexed callHash, bytes data)", "event Initiated(bytes32 indexed callHash, bytes data)", "event Vetoed(bytes32 indexed callHash, bytes data)", "error AlreadyDelayed()", "error ForwardingEarly()", "error TargetUnitialized()", "error Unauthorized(address expected, address actual)"], `0x${string}`, `0x${string}`, "0x6900690069006900690069006900690069006900">;
    write: import("@tevm/contract").WriteActionCreator<readonly ["constructor(address vetoer_, address initiator_, address target_, uint256 operatingDelay_)", "fallback()", "function delay() returns (uint256 delay_)", "function initiator() returns (address initiator_)", "function queuedAt(bytes32 callHash) returns (uint256 queuedAt_)", "function target() returns (address target_)", "function version() view returns (string)", "function vetoer() returns (address vetoer_)", "event DelayActivated(uint256 delay)", "event Forwarded(bytes32 indexed callHash, bytes data)", "event Initiated(bytes32 indexed callHash, bytes data)", "event Vetoed(bytes32 indexed callHash, bytes data)", "error AlreadyDelayed()", "error ForwardingEarly()", "error TargetUnitialized()", "error Unauthorized(address expected, address actual)"], `0x${string}`, `0x${string}`, "0x6900690069006900690069006900690069006900">;
};
export declare const DelayedVetoableAddresses: {
    readonly '10': "0x6900690069006900690069006900690069006900";
};
export declare const DelayedVetoableBytecode: `0x${string}`;
export declare const DelayedVetoableDeployedBytecode: `0x${string}`;
export declare const DelayedVetoableHumanReadableAbi: readonly ["constructor(address vetoer_, address initiator_, address target_, uint256 operatingDelay_)", "fallback()", "function delay() returns (uint256 delay_)", "function initiator() returns (address initiator_)", "function queuedAt(bytes32 callHash) returns (uint256 queuedAt_)", "function target() returns (address target_)", "function version() view returns (string)", "function vetoer() returns (address vetoer_)", "event DelayActivated(uint256 delay)", "event Forwarded(bytes32 indexed callHash, bytes data)", "event Initiated(bytes32 indexed callHash, bytes data)", "event Vetoed(bytes32 indexed callHash, bytes data)", "error AlreadyDelayed()", "error ForwardingEarly()", "error TargetUnitialized()", "error Unauthorized(address expected, address actual)"];
export declare const DelayedVetoableAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "vetoer_";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "initiator_";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "target_";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "operatingDelay_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "fallback";
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "delay";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "delay_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "initiator";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "initiator_";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "queuedAt";
    readonly inputs: readonly [{
        readonly name: "callHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "queuedAt_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "target";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "target_";
        readonly type: "address";
        readonly internalType: "address";
    }];
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
    readonly type: "function";
    readonly name: "vetoer";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "vetoer_";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "DelayActivated";
    readonly inputs: readonly [{
        readonly name: "delay";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Forwarded";
    readonly inputs: readonly [{
        readonly name: "callHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "data";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Initiated";
    readonly inputs: readonly [{
        readonly name: "callHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "data";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Vetoed";
    readonly inputs: readonly [{
        readonly name: "callHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }, {
        readonly name: "data";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "error";
    readonly name: "AlreadyDelayed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ForwardingEarly";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "TargetUnitialized";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "Unauthorized";
    readonly inputs: readonly [{
        readonly name: "expected";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "actual";
        readonly type: "address";
        readonly internalType: "address";
    }];
}];
//# sourceMappingURL=DelayedVetoable.d.ts.map