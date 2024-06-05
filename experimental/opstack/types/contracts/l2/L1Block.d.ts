/**
 * Creates a L1Block contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL1Block } from '@tevm/opstack'
 * const L1Block = createL1Block()
 */
export declare const createL1Block: (chainId?: 10) => Omit<import("@tevm/contract").Script<"L1Block", readonly ["function DEPOSITOR_ACCOUNT() view returns (address)", "function baseFeeScalar() view returns (uint32)", "function basefee() view returns (uint256)", "function batcherHash() view returns (bytes32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function hash() view returns (bytes32)", "function l1FeeOverhead() view returns (uint256)", "function l1FeeScalar() view returns (uint256)", "function number() view returns (uint64)", "function sequenceNumber() view returns (uint64)", "function setL1BlockValues(uint64 _number, uint64 _timestamp, uint256 _basefee, bytes32 _hash, uint64 _sequenceNumber, bytes32 _batcherHash, uint256 _l1FeeOverhead, uint256 _l1FeeScalar)", "function setL1BlockValuesEcotone()", "function timestamp() view returns (uint64)", "function version() view returns (string)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x4200000000000000000000000000000000000015";
    events: import("@tevm/contract").EventActionCreator<readonly ["function DEPOSITOR_ACCOUNT() view returns (address)", "function baseFeeScalar() view returns (uint32)", "function basefee() view returns (uint256)", "function batcherHash() view returns (bytes32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function hash() view returns (bytes32)", "function l1FeeOverhead() view returns (uint256)", "function l1FeeScalar() view returns (uint256)", "function number() view returns (uint64)", "function sequenceNumber() view returns (uint64)", "function setL1BlockValues(uint64 _number, uint64 _timestamp, uint256 _basefee, bytes32 _hash, uint64 _sequenceNumber, bytes32 _batcherHash, uint256 _l1FeeOverhead, uint256 _l1FeeScalar)", "function setL1BlockValuesEcotone()", "function timestamp() view returns (uint64)", "function version() view returns (string)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000015">;
    read: import("@tevm/contract").ReadActionCreator<readonly ["function DEPOSITOR_ACCOUNT() view returns (address)", "function baseFeeScalar() view returns (uint32)", "function basefee() view returns (uint256)", "function batcherHash() view returns (bytes32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function hash() view returns (bytes32)", "function l1FeeOverhead() view returns (uint256)", "function l1FeeScalar() view returns (uint256)", "function number() view returns (uint64)", "function sequenceNumber() view returns (uint64)", "function setL1BlockValues(uint64 _number, uint64 _timestamp, uint256 _basefee, bytes32 _hash, uint64 _sequenceNumber, bytes32 _batcherHash, uint256 _l1FeeOverhead, uint256 _l1FeeScalar)", "function setL1BlockValuesEcotone()", "function timestamp() view returns (uint64)", "function version() view returns (string)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000015">;
    write: import("@tevm/contract").WriteActionCreator<readonly ["function DEPOSITOR_ACCOUNT() view returns (address)", "function baseFeeScalar() view returns (uint32)", "function basefee() view returns (uint256)", "function batcherHash() view returns (bytes32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function hash() view returns (bytes32)", "function l1FeeOverhead() view returns (uint256)", "function l1FeeScalar() view returns (uint256)", "function number() view returns (uint64)", "function sequenceNumber() view returns (uint64)", "function setL1BlockValues(uint64 _number, uint64 _timestamp, uint256 _basefee, bytes32 _hash, uint64 _sequenceNumber, bytes32 _batcherHash, uint256 _l1FeeOverhead, uint256 _l1FeeScalar)", "function setL1BlockValuesEcotone()", "function timestamp() view returns (uint64)", "function version() view returns (string)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000015">;
};
export declare const L1BlockAddresses: {
    readonly '10': "0x4200000000000000000000000000000000000015";
};
export declare const L1BlockBytecode: `0x${string}`;
export declare const L1BlockDeployedBytecode: `0x${string}`;
export declare const L1BlockHumanReadableAbi: readonly ["function DEPOSITOR_ACCOUNT() view returns (address)", "function baseFeeScalar() view returns (uint32)", "function basefee() view returns (uint256)", "function batcherHash() view returns (bytes32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function hash() view returns (bytes32)", "function l1FeeOverhead() view returns (uint256)", "function l1FeeScalar() view returns (uint256)", "function number() view returns (uint64)", "function sequenceNumber() view returns (uint64)", "function setL1BlockValues(uint64 _number, uint64 _timestamp, uint256 _basefee, bytes32 _hash, uint64 _sequenceNumber, bytes32 _batcherHash, uint256 _l1FeeOverhead, uint256 _l1FeeScalar)", "function setL1BlockValuesEcotone()", "function timestamp() view returns (uint64)", "function version() view returns (string)"];
export declare const L1BlockAbi: readonly [{
    readonly type: "function";
    readonly name: "DEPOSITOR_ACCOUNT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "baseFeeScalar";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "basefee";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
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
    readonly name: "blobBaseFee";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "blobBaseFeeScalar";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "hash";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "l1FeeOverhead";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "l1FeeScalar";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "number";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "sequenceNumber";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "setL1BlockValues";
    readonly inputs: readonly [{
        readonly name: "_number";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }, {
        readonly name: "_timestamp";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }, {
        readonly name: "_basefee";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_hash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_sequenceNumber";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }, {
        readonly name: "_batcherHash";
        readonly type: "bytes32";
        readonly internalType: "bytes32";
    }, {
        readonly name: "_l1FeeOverhead";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_l1FeeScalar";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "setL1BlockValuesEcotone";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "timestamp";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
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
}];
//# sourceMappingURL=L1Block.d.ts.map