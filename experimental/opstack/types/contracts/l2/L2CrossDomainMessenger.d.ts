/**
 * Creates a L2CrossDomainMessenger contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL2CrossDomainMessenger } from '@tevm/opstack'
 * const L2CrossDomainMessenger = createL2CrossDomainMessenger()
 */
export declare const createL2CrossDomainMessenger: (chainId?: 10) => Omit<import("@tevm/contract").Script<"L2CrossDomainMessenger", readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _l1CrossDomainMessenger)", "function l1CrossDomainMessenger() view returns (address)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x4200000000000000000000000000000000000007";
    events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _l1CrossDomainMessenger)", "function l1CrossDomainMessenger() view returns (address)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000007">;
    read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _l1CrossDomainMessenger)", "function l1CrossDomainMessenger() view returns (address)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000007">;
    write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _l1CrossDomainMessenger)", "function l1CrossDomainMessenger() view returns (address)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000007">;
};
export declare const L2CrossDomainMessengerAddresses: {
    readonly '10': "0x4200000000000000000000000000000000000007";
};
export declare const L2CrossDomainMessengerBytecode: `0x${string}`;
export declare const L2CrossDomainMessengerDeployedBytecode: `0x${string}`;
export declare const L2CrossDomainMessengerHumanReadableAbi: readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _l1CrossDomainMessenger)", "function l1CrossDomainMessenger() view returns (address)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"];
export declare const L2CrossDomainMessengerAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [];
    readonly stateMutability: "nonpayable";
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
    readonly name: "MIN_GAS_CALLDATA_OVERHEAD";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "OTHER_MESSENGER";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract CrossDomainMessenger";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "RELAY_CALL_OVERHEAD";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "RELAY_CONSTANT_OVERHEAD";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "RELAY_GAS_CHECK_BUFFER";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "RELAY_RESERVED_GAS";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "baseGas";
    readonly inputs: readonly [{
        readonly name: "_message";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint64";
        readonly internalType: "uint64";
    }];
    readonly stateMutability: "pure";
}, {
    readonly type: "function";
    readonly name: "failedMessages";
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
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_l1CrossDomainMessenger";
        readonly type: "address";
        readonly internalType: "contract CrossDomainMessenger";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "l1CrossDomainMessenger";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract CrossDomainMessenger";
    }];
    readonly stateMutability: "view";
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
    readonly name: "otherMessenger";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract CrossDomainMessenger";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "paused";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "relayMessage";
    readonly inputs: readonly [{
        readonly name: "_nonce";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_sender";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_target";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_value";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_message";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "sendMessage";
    readonly inputs: readonly [{
        readonly name: "_target";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_message";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "successfulMessages";
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
    readonly type: "function";
    readonly name: "xDomainMessageSender";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "event";
    readonly name: "FailedRelayedMessage";
    readonly inputs: readonly [{
        readonly name: "msgHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
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
    readonly name: "RelayedMessage";
    readonly inputs: readonly [{
        readonly name: "msgHash";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "bytes32";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentMessage";
    readonly inputs: readonly [{
        readonly name: "target";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "message";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }, {
        readonly name: "messageNonce";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "gasLimit";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "SentMessageExtension1";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "value";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }];
    readonly anonymous: false;
}];
//# sourceMappingURL=L2CrossDomainMessenger.d.ts.map