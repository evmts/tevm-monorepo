/**
 * Creates a GasPriceOracle contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createGasPriceOracle } from '@tevm/opstack'
 * const GasPriceOracle = createGasPriceOracle()
 */
export declare const createGasPriceOracle: (chainId?: 10) => Omit<import("@tevm/contract").Script<"GasPriceOracle", readonly ["function DECIMALS() view returns (uint256)", "function baseFee() view returns (uint256)", "function baseFeeScalar() view returns (uint32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function decimals() pure returns (uint256)", "function gasPrice() view returns (uint256)", "function getL1Fee(bytes _data) view returns (uint256)", "function getL1GasUsed(bytes _data) view returns (uint256)", "function isEcotone() view returns (bool)", "function l1BaseFee() view returns (uint256)", "function overhead() view returns (uint256)", "function scalar() view returns (uint256)", "function setEcotone()", "function version() view returns (string)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x420000000000000000000000000000000000000F";
    events: import("@tevm/contract").EventActionCreator<readonly ["function DECIMALS() view returns (uint256)", "function baseFee() view returns (uint256)", "function baseFeeScalar() view returns (uint32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function decimals() pure returns (uint256)", "function gasPrice() view returns (uint256)", "function getL1Fee(bytes _data) view returns (uint256)", "function getL1GasUsed(bytes _data) view returns (uint256)", "function isEcotone() view returns (bool)", "function l1BaseFee() view returns (uint256)", "function overhead() view returns (uint256)", "function scalar() view returns (uint256)", "function setEcotone()", "function version() view returns (string)"], `0x${string}`, `0x${string}`, "0x420000000000000000000000000000000000000F">;
    read: import("@tevm/contract").ReadActionCreator<readonly ["function DECIMALS() view returns (uint256)", "function baseFee() view returns (uint256)", "function baseFeeScalar() view returns (uint32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function decimals() pure returns (uint256)", "function gasPrice() view returns (uint256)", "function getL1Fee(bytes _data) view returns (uint256)", "function getL1GasUsed(bytes _data) view returns (uint256)", "function isEcotone() view returns (bool)", "function l1BaseFee() view returns (uint256)", "function overhead() view returns (uint256)", "function scalar() view returns (uint256)", "function setEcotone()", "function version() view returns (string)"], `0x${string}`, `0x${string}`, "0x420000000000000000000000000000000000000F">;
    write: import("@tevm/contract").WriteActionCreator<readonly ["function DECIMALS() view returns (uint256)", "function baseFee() view returns (uint256)", "function baseFeeScalar() view returns (uint32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function decimals() pure returns (uint256)", "function gasPrice() view returns (uint256)", "function getL1Fee(bytes _data) view returns (uint256)", "function getL1GasUsed(bytes _data) view returns (uint256)", "function isEcotone() view returns (bool)", "function l1BaseFee() view returns (uint256)", "function overhead() view returns (uint256)", "function scalar() view returns (uint256)", "function setEcotone()", "function version() view returns (string)"], `0x${string}`, `0x${string}`, "0x420000000000000000000000000000000000000F">;
};
export declare const GasPriceOracleAddresses: {
    readonly '10': "0x420000000000000000000000000000000000000F";
};
export declare const GasPriceOracleBytecode: `0x${string}`;
export declare const GasPriceOracleDeployedBytecode: `0x${string}`;
export declare const GasPriceOracleHumanReadableAbi: readonly ["function DECIMALS() view returns (uint256)", "function baseFee() view returns (uint256)", "function baseFeeScalar() view returns (uint32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function decimals() pure returns (uint256)", "function gasPrice() view returns (uint256)", "function getL1Fee(bytes _data) view returns (uint256)", "function getL1GasUsed(bytes _data) view returns (uint256)", "function isEcotone() view returns (bool)", "function l1BaseFee() view returns (uint256)", "function overhead() view returns (uint256)", "function scalar() view returns (uint256)", "function setEcotone()", "function version() view returns (string)"];
export declare const GasPriceOracleAbi: readonly [{
    readonly type: "function";
    readonly name: "DECIMALS";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "baseFee";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
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
    readonly name: "decimals";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "pure";
}, {
    readonly type: "function";
    readonly name: "gasPrice";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getL1Fee";
    readonly inputs: readonly [{
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getL1GasUsed";
    readonly inputs: readonly [{
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isEcotone";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "l1BaseFee";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
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
    readonly name: "setEcotone";
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
}];
//# sourceMappingURL=GasPriceOracle.d.ts.map