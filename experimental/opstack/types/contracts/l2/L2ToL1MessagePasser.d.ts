/**
 * Creates a L2ToL1MessagePasser contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL2ToL1MessagePasser } from '@tevm/opstack'
 * const L2ToL1MessagePasser = createL2ToL1MessagePasser()
 */
export declare const createL2ToL1MessagePasser: (chainId?: 10) => Omit<import("@tevm/contract").Script<"L2ToL1MessagePasser", readonly ["receive() external payable", "function MESSAGE_VERSION() view returns (uint16)", "function burn()", "function initiateWithdrawal(address _target, uint256 _gasLimit, bytes _data) payable", "function messageNonce() view returns (uint256)", "function sentMessages(bytes32) view returns (bool)", "function version() view returns (string)", "event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)", "event WithdrawerBalanceBurnt(uint256 indexed amount)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x4200000000000000000000000000000000000016";
    events: import("@tevm/contract").EventActionCreator<readonly ["receive() external payable", "function MESSAGE_VERSION() view returns (uint16)", "function burn()", "function initiateWithdrawal(address _target, uint256 _gasLimit, bytes _data) payable", "function messageNonce() view returns (uint256)", "function sentMessages(bytes32) view returns (bool)", "function version() view returns (string)", "event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)", "event WithdrawerBalanceBurnt(uint256 indexed amount)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000016">;
    read: import("@tevm/contract").ReadActionCreator<readonly ["receive() external payable", "function MESSAGE_VERSION() view returns (uint16)", "function burn()", "function initiateWithdrawal(address _target, uint256 _gasLimit, bytes _data) payable", "function messageNonce() view returns (uint256)", "function sentMessages(bytes32) view returns (bool)", "function version() view returns (string)", "event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)", "event WithdrawerBalanceBurnt(uint256 indexed amount)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000016">;
    write: import("@tevm/contract").WriteActionCreator<readonly ["receive() external payable", "function MESSAGE_VERSION() view returns (uint16)", "function burn()", "function initiateWithdrawal(address _target, uint256 _gasLimit, bytes _data) payable", "function messageNonce() view returns (uint256)", "function sentMessages(bytes32) view returns (bool)", "function version() view returns (string)", "event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)", "event WithdrawerBalanceBurnt(uint256 indexed amount)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000016">;
};
export declare const L2ToL1MessagePasserAddresses: {
    readonly '10': "0x4200000000000000000000000000000000000016";
};
export declare const L2ToL1MessagePasserBytecode: `0x${string}`;
export declare const L2ToL1MessagePasserDeployedBytecode: `0x${string}`;
export declare const L2ToL1MessagePasserHumanReadableAbi: readonly ["receive() external payable", "function MESSAGE_VERSION() view returns (uint16)", "function burn()", "function initiateWithdrawal(address _target, uint256 _gasLimit, bytes _data) payable", "function messageNonce() view returns (uint256)", "function sentMessages(bytes32) view returns (bool)", "function version() view returns (string)", "event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)", "event WithdrawerBalanceBurnt(uint256 indexed amount)"];
export declare const L2ToL1MessagePasserAbi: readonly [{
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "MESSAGE_VERSION";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint16";
        readonly internalType: "uint16";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "burn";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "initiateWithdrawal";
    readonly inputs: readonly [{
        readonly name: "_target";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_gasLimit";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_data";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "messageNonce";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "sentMessages";
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
    readonly name: "MessagePassed";
    readonly inputs: readonly [{
        readonly name: "nonce";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }, {
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "target";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "value";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "gasLimit";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "data";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }, {
        readonly name: "withdrawalHash";
        readonly type: "bytes32";
        readonly indexed: false;
        readonly internalType: "bytes32";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "WithdrawerBalanceBurnt";
    readonly inputs: readonly [{
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}];
//# sourceMappingURL=L2ToL1MessagePasser.d.ts.map