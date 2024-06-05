import * as _tevm_contract from '@tevm/contract';
import * as _tevm_memory_client from '@tevm/memory-client';
import * as _tevm_decorators from '@tevm/decorators';
import * as _tevm_txpool from '@tevm/txpool';
import * as _tevm_vm from '@tevm/vm';
import * as _tevm_base_client from '@tevm/base-client';
import * as _tevm_receipt_manager from '@tevm/receipt-manager';
import * as _tevm_logger from '@tevm/logger';
import * as _tevm_procedures_types from '@tevm/procedures-types';
import * as _tevm_actions_types from '@tevm/actions-types';
import * as viem from 'viem';

/**
 * Creates a DelayedVetoable contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createDelayedVetoable } from '@tevm/opstack'
 * const DelayedVetoable = createDelayedVetoable()
 */
declare const createDelayedVetoable: (chainId?: 10) => Omit<_tevm_contract.Script<"DelayedVetoable", readonly ["constructor(address vetoer_, address initiator_, address target_, uint256 operatingDelay_)", "fallback()", "function delay() returns (uint256 delay_)", "function initiator() returns (address initiator_)", "function queuedAt(bytes32 callHash) returns (uint256 queuedAt_)", "function target() returns (address target_)", "function version() view returns (string)", "function vetoer() returns (address vetoer_)", "event DelayActivated(uint256 delay)", "event Forwarded(bytes32 indexed callHash, bytes data)", "event Initiated(bytes32 indexed callHash, bytes data)", "event Vetoed(bytes32 indexed callHash, bytes data)", "error AlreadyDelayed()", "error ForwardingEarly()", "error TargetUnitialized()", "error Unauthorized(address expected, address actual)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x6900690069006900690069006900690069006900";
    events: _tevm_contract.EventActionCreator<readonly ["constructor(address vetoer_, address initiator_, address target_, uint256 operatingDelay_)", "fallback()", "function delay() returns (uint256 delay_)", "function initiator() returns (address initiator_)", "function queuedAt(bytes32 callHash) returns (uint256 queuedAt_)", "function target() returns (address target_)", "function version() view returns (string)", "function vetoer() returns (address vetoer_)", "event DelayActivated(uint256 delay)", "event Forwarded(bytes32 indexed callHash, bytes data)", "event Initiated(bytes32 indexed callHash, bytes data)", "event Vetoed(bytes32 indexed callHash, bytes data)", "error AlreadyDelayed()", "error ForwardingEarly()", "error TargetUnitialized()", "error Unauthorized(address expected, address actual)"], `0x${string}`, `0x${string}`, "0x6900690069006900690069006900690069006900">;
    read: _tevm_contract.ReadActionCreator<readonly ["constructor(address vetoer_, address initiator_, address target_, uint256 operatingDelay_)", "fallback()", "function delay() returns (uint256 delay_)", "function initiator() returns (address initiator_)", "function queuedAt(bytes32 callHash) returns (uint256 queuedAt_)", "function target() returns (address target_)", "function version() view returns (string)", "function vetoer() returns (address vetoer_)", "event DelayActivated(uint256 delay)", "event Forwarded(bytes32 indexed callHash, bytes data)", "event Initiated(bytes32 indexed callHash, bytes data)", "event Vetoed(bytes32 indexed callHash, bytes data)", "error AlreadyDelayed()", "error ForwardingEarly()", "error TargetUnitialized()", "error Unauthorized(address expected, address actual)"], `0x${string}`, `0x${string}`, "0x6900690069006900690069006900690069006900">;
    write: _tevm_contract.WriteActionCreator<readonly ["constructor(address vetoer_, address initiator_, address target_, uint256 operatingDelay_)", "fallback()", "function delay() returns (uint256 delay_)", "function initiator() returns (address initiator_)", "function queuedAt(bytes32 callHash) returns (uint256 queuedAt_)", "function target() returns (address target_)", "function version() view returns (string)", "function vetoer() returns (address vetoer_)", "event DelayActivated(uint256 delay)", "event Forwarded(bytes32 indexed callHash, bytes data)", "event Initiated(bytes32 indexed callHash, bytes data)", "event Vetoed(bytes32 indexed callHash, bytes data)", "error AlreadyDelayed()", "error ForwardingEarly()", "error TargetUnitialized()", "error Unauthorized(address expected, address actual)"], `0x${string}`, `0x${string}`, "0x6900690069006900690069006900690069006900">;
};
declare const DelayedVetoableAddresses: {
    readonly '10': "0x6900690069006900690069006900690069006900";
};
declare const DelayedVetoableBytecode: `0x${string}`;
declare const DelayedVetoableDeployedBytecode: `0x${string}`;
declare const DelayedVetoableHumanReadableAbi: readonly ["constructor(address vetoer_, address initiator_, address target_, uint256 operatingDelay_)", "fallback()", "function delay() returns (uint256 delay_)", "function initiator() returns (address initiator_)", "function queuedAt(bytes32 callHash) returns (uint256 queuedAt_)", "function target() returns (address target_)", "function version() view returns (string)", "function vetoer() returns (address vetoer_)", "event DelayActivated(uint256 delay)", "event Forwarded(bytes32 indexed callHash, bytes data)", "event Initiated(bytes32 indexed callHash, bytes data)", "event Vetoed(bytes32 indexed callHash, bytes data)", "error AlreadyDelayed()", "error ForwardingEarly()", "error TargetUnitialized()", "error Unauthorized(address expected, address actual)"];
declare const DelayedVetoableAbi: readonly [{
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

/**
 * Creates a L1CrossDomainMessenger contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL1CrossDomainMessenger } from '@tevm/opstack'
 * const L1CrossDomainMessenger = createL1CrossDomainMessenger()
 */
declare const createL1CrossDomainMessenger: (chainId?: 10) => Omit<_tevm_contract.Script<"L1CrossDomainMessenger", readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function PORTAL() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _superchainConfig, address _portal)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function portal() view returns (address)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1";
    events: _tevm_contract.EventActionCreator<readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function PORTAL() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _superchainConfig, address _portal)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function portal() view returns (address)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"], `0x${string}`, `0x${string}`, "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1">;
    read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function PORTAL() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _superchainConfig, address _portal)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function portal() view returns (address)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"], `0x${string}`, `0x${string}`, "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1">;
    write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function PORTAL() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _superchainConfig, address _portal)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function portal() view returns (address)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"], `0x${string}`, `0x${string}`, "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1">;
};
declare const L1CrossDomainMessengerAddresses: {
    readonly '10': "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1";
};
declare const L1CrossDomainMessengerBytecode: `0x${string}`;
declare const L1CrossDomainMessengerDeployedBytecode: `0x${string}`;
declare const L1CrossDomainMessengerHumanReadableAbi: readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function PORTAL() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _superchainConfig, address _portal)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function portal() view returns (address)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"];
declare const L1CrossDomainMessengerAbi: readonly [{
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
    readonly name: "PORTAL";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract OptimismPortal";
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
        readonly name: "_superchainConfig";
        readonly type: "address";
        readonly internalType: "contract SuperchainConfig";
    }, {
        readonly name: "_portal";
        readonly type: "address";
        readonly internalType: "contract OptimismPortal";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
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
    readonly name: "portal";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract OptimismPortal";
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

/**
 * Creates a L1ERC721Bridge contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL1ERC721Bridge } from '@tevm/opstack'
 * const L1ERC721Bridge = createL1ERC721Bridge()
 */
declare const createL1ERC721Bridge: (chainId?: 10) => Omit<_tevm_contract.Script<"L1ERC721Bridge", readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D";
    events: _tevm_contract.EventActionCreator<readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D">;
    read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D">;
    write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D">;
};
declare const L1ERC721BridgeAddresses: {
    readonly '10': "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D";
};
declare const L1ERC721BridgeBytecode: `0x${string}`;
declare const L1ERC721BridgeDeployedBytecode: `0x${string}`;
declare const L1ERC721BridgeHumanReadableAbi: readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"];
declare const L1ERC721BridgeAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "MESSENGER";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract CrossDomainMessenger";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "OTHER_BRIDGE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract StandardBridge";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "bridgeERC721";
    readonly inputs: readonly [{
        readonly name: "_localToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_remoteToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_tokenId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "bridgeERC721To";
    readonly inputs: readonly [{
        readonly name: "_localToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_remoteToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_tokenId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "deposits";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
        readonly internalType: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "finalizeBridgeERC721";
    readonly inputs: readonly [{
        readonly name: "_localToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_remoteToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_from";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_tokenId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_messenger";
        readonly type: "address";
        readonly internalType: "contract CrossDomainMessenger";
    }, {
        readonly name: "_superchainConfig";
        readonly type: "address";
        readonly internalType: "contract SuperchainConfig";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "messenger";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract CrossDomainMessenger";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "otherBridge";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract StandardBridge";
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
    readonly name: "ERC721BridgeFinalized";
    readonly inputs: readonly [{
        readonly name: "localToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "remoteToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "tokenId";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ERC721BridgeInitiated";
    readonly inputs: readonly [{
        readonly name: "localToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "remoteToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "tokenId";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
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
}];

/**
 * Creates a L1StandardBridge contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL1StandardBridge } from '@tevm/opstack'
 * const L1StandardBridge = createL1StandardBridge()
 */
declare const createL1StandardBridge: (chainId?: 10) => Omit<_tevm_contract.Script<"L1StandardBridge", readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1";
    events: _tevm_contract.EventActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1">;
    read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1">;
    write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1">;
};
declare const L1StandardBridgeAddresses: {
    readonly '10': "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1";
};
declare const L1StandardBridgeBytecode: `0x${string}`;
declare const L1StandardBridgeDeployedBytecode: `0x${string}`;
declare const L1StandardBridgeHumanReadableAbi: readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"];
declare const L1StandardBridgeAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "MESSENGER";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract CrossDomainMessenger";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "OTHER_BRIDGE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract StandardBridge";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "bridgeERC20";
    readonly inputs: readonly [{
        readonly name: "_localToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_remoteToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "bridgeERC20To";
    readonly inputs: readonly [{
        readonly name: "_localToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_remoteToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "bridgeETH";
    readonly inputs: readonly [{
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "bridgeETHTo";
    readonly inputs: readonly [{
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "depositERC20";
    readonly inputs: readonly [{
        readonly name: "_l1Token";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_l2Token";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "depositERC20To";
    readonly inputs: readonly [{
        readonly name: "_l1Token";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_l2Token";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "depositETH";
    readonly inputs: readonly [{
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "depositETHTo";
    readonly inputs: readonly [{
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "deposits";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "finalizeBridgeERC20";
    readonly inputs: readonly [{
        readonly name: "_localToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_remoteToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_from";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "finalizeBridgeETH";
    readonly inputs: readonly [{
        readonly name: "_from";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "finalizeERC20Withdrawal";
    readonly inputs: readonly [{
        readonly name: "_l1Token";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_l2Token";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_from";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "finalizeETHWithdrawal";
    readonly inputs: readonly [{
        readonly name: "_from";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_messenger";
        readonly type: "address";
        readonly internalType: "contract CrossDomainMessenger";
    }, {
        readonly name: "_superchainConfig";
        readonly type: "address";
        readonly internalType: "contract SuperchainConfig";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "l2TokenBridge";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "messenger";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract CrossDomainMessenger";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "otherBridge";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract StandardBridge";
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
    readonly name: "ERC20BridgeFinalized";
    readonly inputs: readonly [{
        readonly name: "localToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "remoteToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ERC20BridgeInitiated";
    readonly inputs: readonly [{
        readonly name: "localToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "remoteToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ERC20DepositInitiated";
    readonly inputs: readonly [{
        readonly name: "l1Token";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "l2Token";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ERC20WithdrawalFinalized";
    readonly inputs: readonly [{
        readonly name: "l1Token";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "l2Token";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ETHBridgeFinalized";
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
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ETHBridgeInitiated";
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
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ETHDepositInitiated";
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
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ETHWithdrawalFinalized";
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
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
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
}];

/**
 * Creates a L2OutputOracle contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL2OutputOracle } from '@tevm/opstack'
 * const L2OutputOracle = createL2OutputOracle()
 */
declare const createL2OutputOracle: (chainId?: 10) => Omit<_tevm_contract.Script<"L2OutputOracle", readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"]>, "address" | "events" | "read" | "write"> & {
    address: "0xdfe97868233d1aa22e815a266982f2cf17685a27";
    events: _tevm_contract.EventActionCreator<readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"], `0x${string}`, `0x${string}`, "0xdfe97868233d1aa22e815a266982f2cf17685a27">;
    read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"], `0x${string}`, `0x${string}`, "0xdfe97868233d1aa22e815a266982f2cf17685a27">;
    write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"], `0x${string}`, `0x${string}`, "0xdfe97868233d1aa22e815a266982f2cf17685a27">;
};
declare const L2OutputOracleAddresses: {
    readonly '10': "0xdfe97868233d1aa22e815a266982f2cf17685a27";
};
declare const L2OutputOracleBytecode: `0x${string}`;
declare const L2OutputOracleDeployedBytecode: `0x${string}`;
declare const L2OutputOracleHumanReadableAbi: readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"];
declare const L2OutputOracleAbi: readonly [{
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

/**
 * Creates a OptimismPortal2 contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createOptimismPortal2 } from '@tevm/opstack'
 * const OptimismPortal2 = createOptimismPortal2()
 */
declare const createOptimismPortal2: (chainId?: 10) => Omit<_tevm_contract.Script<"OptimismPortal2", readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"]>, "address" | "events" | "read" | "write"> & {
    address: "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed";
    events: _tevm_contract.EventActionCreator<readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"], `0x${string}`, `0x${string}`, "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed">;
    read: _tevm_contract.ReadActionCreator<readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"], `0x${string}`, `0x${string}`, "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed">;
    write: _tevm_contract.WriteActionCreator<readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"], `0x${string}`, `0x${string}`, "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed">;
};
declare const OptimismPortal2Addresses: {
    readonly '10': "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed";
};
declare const OptimismPortal2Bytecode: `0x${string}`;
declare const OptimismPortal2DeployedBytecode: `0x${string}`;
declare const OptimismPortal2HumanReadableAbi: readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"];
declare const OptimismPortal2Abi: readonly [{
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

/**
 * Creates a DisputeGameFactory contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createDisputeGameFactory } from '@tevm/opstack'
 * const DisputeGameFactory = createDisputeGameFactory()
 */
declare const createDisputeGameFactory: (chainId?: 10) => Omit<_tevm_contract.Script<"DisputeGameFactory", readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x6901690169016901690169016901690169016901";
    events: _tevm_contract.EventActionCreator<readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"], `0x${string}`, `0x${string}`, "0x6901690169016901690169016901690169016901">;
    read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"], `0x${string}`, `0x${string}`, "0x6901690169016901690169016901690169016901">;
    write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"], `0x${string}`, `0x${string}`, "0x6901690169016901690169016901690169016901">;
};
declare const DisputeGameFactoryAddresses: {
    readonly '10': "0x6901690169016901690169016901690169016901";
};
declare const DisputeGameFactoryBytecode: `0x${string}`;
declare const DisputeGameFactoryDeployedBytecode: `0x${string}`;
declare const DisputeGameFactoryHumanReadableAbi: readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"];
declare const DisputeGameFactoryAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "create";
    readonly inputs: readonly [{
        readonly name: "_gameType";
        readonly type: "uint32";
        readonly internalType: "GameType";
    }, {
        readonly name: "_rootClaim";
        readonly type: "bytes32";
        readonly internalType: "Claim";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "proxy_";
        readonly type: "address";
        readonly internalType: "contract IDisputeGame";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "findLatestGames";
    readonly inputs: readonly [{
        readonly name: "_gameType";
        readonly type: "uint32";
        readonly internalType: "GameType";
    }, {
        readonly name: "_start";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_n";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "games_";
        readonly type: "tuple[]";
        readonly internalType: "struct IDisputeGameFactory.GameSearchResult[]";
        readonly components: readonly [{
            readonly name: "index";
            readonly type: "uint256";
            readonly internalType: "uint256";
        }, {
            readonly name: "metadata";
            readonly type: "bytes32";
            readonly internalType: "GameId";
        }, {
            readonly name: "timestamp";
            readonly type: "uint64";
            readonly internalType: "Timestamp";
        }, {
            readonly name: "rootClaim";
            readonly type: "bytes32";
            readonly internalType: "Claim";
        }, {
            readonly name: "extraData";
            readonly type: "bytes";
            readonly internalType: "bytes";
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "gameAtIndex";
    readonly inputs: readonly [{
        readonly name: "_index";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "gameType_";
        readonly type: "uint32";
        readonly internalType: "GameType";
    }, {
        readonly name: "timestamp_";
        readonly type: "uint64";
        readonly internalType: "Timestamp";
    }, {
        readonly name: "proxy_";
        readonly type: "address";
        readonly internalType: "contract IDisputeGame";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "gameCount";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "gameCount_";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "gameImpls";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "uint32";
        readonly internalType: "GameType";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract IDisputeGame";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "games";
    readonly inputs: readonly [{
        readonly name: "_gameType";
        readonly type: "uint32";
        readonly internalType: "GameType";
    }, {
        readonly name: "_rootClaim";
        readonly type: "bytes32";
        readonly internalType: "Claim";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "proxy_";
        readonly type: "address";
        readonly internalType: "contract IDisputeGame";
    }, {
        readonly name: "timestamp_";
        readonly type: "uint64";
        readonly internalType: "Timestamp";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getGameUUID";
    readonly inputs: readonly [{
        readonly name: "_gameType";
        readonly type: "uint32";
        readonly internalType: "GameType";
    }, {
        readonly name: "_rootClaim";
        readonly type: "bytes32";
        readonly internalType: "Claim";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "uuid_";
        readonly type: "bytes32";
        readonly internalType: "Hash";
    }];
    readonly stateMutability: "pure";
}, {
    readonly type: "function";
    readonly name: "initBonds";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "uint32";
        readonly internalType: "GameType";
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
        readonly name: "_owner";
        readonly type: "address";
        readonly internalType: "address";
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
    readonly name: "renounceOwnership";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "setImplementation";
    readonly inputs: readonly [{
        readonly name: "_gameType";
        readonly type: "uint32";
        readonly internalType: "GameType";
    }, {
        readonly name: "_impl";
        readonly type: "address";
        readonly internalType: "contract IDisputeGame";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "setInitBond";
    readonly inputs: readonly [{
        readonly name: "_gameType";
        readonly type: "uint32";
        readonly internalType: "GameType";
    }, {
        readonly name: "_initBond";
        readonly type: "uint256";
        readonly internalType: "uint256";
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
    readonly name: "DisputeGameCreated";
    readonly inputs: readonly [{
        readonly name: "disputeProxy";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "gameType";
        readonly type: "uint32";
        readonly indexed: true;
        readonly internalType: "GameType";
    }, {
        readonly name: "rootClaim";
        readonly type: "bytes32";
        readonly indexed: true;
        readonly internalType: "Claim";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ImplementationSet";
    readonly inputs: readonly [{
        readonly name: "impl";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "gameType";
        readonly type: "uint32";
        readonly indexed: true;
        readonly internalType: "GameType";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "InitBondUpdated";
    readonly inputs: readonly [{
        readonly name: "gameType";
        readonly type: "uint32";
        readonly indexed: true;
        readonly internalType: "GameType";
    }, {
        readonly name: "newBond";
        readonly type: "uint256";
        readonly indexed: true;
        readonly internalType: "uint256";
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
}, {
    readonly type: "error";
    readonly name: "GameAlreadyExists";
    readonly inputs: readonly [{
        readonly name: "uuid";
        readonly type: "bytes32";
        readonly internalType: "Hash";
    }];
}, {
    readonly type: "error";
    readonly name: "InsufficientBond";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NoImplementation";
    readonly inputs: readonly [{
        readonly name: "gameType";
        readonly type: "uint32";
        readonly internalType: "GameType";
    }];
}];

/**
 * Creates a ProtocolVersions contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createProtocolVersions } from '@tevm/opstack'
 * const ProtocolVersions = createProtocolVersions()
 */
declare const createProtocolVersions: (chainId?: 10) => Omit<_tevm_contract.Script<"ProtocolVersions", readonly ["constructor()", "function RECOMMENDED_SLOT() view returns (bytes32)", "function REQUIRED_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function initialize(address _owner, uint256 _required, uint256 _recommended)", "function owner() view returns (address)", "function recommended() view returns (uint256 out_)", "function renounceOwnership()", "function required() view returns (uint256 out_)", "function setRecommended(uint256 _recommended)", "function setRequired(uint256 _required)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x6903690369036903690369036903690369036903";
    events: _tevm_contract.EventActionCreator<readonly ["constructor()", "function RECOMMENDED_SLOT() view returns (bytes32)", "function REQUIRED_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function initialize(address _owner, uint256 _required, uint256 _recommended)", "function owner() view returns (address)", "function recommended() view returns (uint256 out_)", "function renounceOwnership()", "function required() view returns (uint256 out_)", "function setRecommended(uint256 _recommended)", "function setRequired(uint256 _required)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x6903690369036903690369036903690369036903">;
    read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "function RECOMMENDED_SLOT() view returns (bytes32)", "function REQUIRED_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function initialize(address _owner, uint256 _required, uint256 _recommended)", "function owner() view returns (address)", "function recommended() view returns (uint256 out_)", "function renounceOwnership()", "function required() view returns (uint256 out_)", "function setRecommended(uint256 _recommended)", "function setRequired(uint256 _required)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x6903690369036903690369036903690369036903">;
    write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "function RECOMMENDED_SLOT() view returns (bytes32)", "function REQUIRED_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function initialize(address _owner, uint256 _required, uint256 _recommended)", "function owner() view returns (address)", "function recommended() view returns (uint256 out_)", "function renounceOwnership()", "function required() view returns (uint256 out_)", "function setRecommended(uint256 _recommended)", "function setRequired(uint256 _required)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x6903690369036903690369036903690369036903">;
};
declare const ProtocolVersionsAddresses: {
    readonly '10': "0x6903690369036903690369036903690369036903";
};
declare const ProtocolVersionsBytecode: `0x${string}`;
declare const ProtocolVersionsDeployedBytecode: `0x${string}`;
declare const ProtocolVersionsHumanReadableAbi: readonly ["constructor()", "function RECOMMENDED_SLOT() view returns (bytes32)", "function REQUIRED_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function initialize(address _owner, uint256 _required, uint256 _recommended)", "function owner() view returns (address)", "function recommended() view returns (uint256 out_)", "function renounceOwnership()", "function required() view returns (uint256 out_)", "function setRecommended(uint256 _recommended)", "function setRequired(uint256 _required)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"];
declare const ProtocolVersionsAbi: readonly [{
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

/**
 * Creates a SuperchainConfig contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createSuperchainConfig } from '@tevm/opstack'
 * const SuperchainConfig = createSuperchainConfig()
 */
declare const createSuperchainConfig: (chainId?: 10) => Omit<_tevm_contract.Script<"SuperchainConfig", readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"]>, "address" | "events" | "read" | "write"> & {
    address: "0x6902690269026902690269026902690269026902";
    events: _tevm_contract.EventActionCreator<readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"], `0x${string}`, `0x${string}`, "0x6902690269026902690269026902690269026902">;
    read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"], `0x${string}`, `0x${string}`, "0x6902690269026902690269026902690269026902">;
    write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"], `0x${string}`, `0x${string}`, "0x6902690269026902690269026902690269026902">;
};
declare const SuperchainConfigAddresses: {
    readonly '10': "0x6902690269026902690269026902690269026902";
};
declare const SuperchainConfigBytecode: `0x${string}`;
declare const SuperchainConfigDeployedBytecode: `0x${string}`;
declare const SuperchainConfigHumanReadableAbi: readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"];
declare const SuperchainConfigAbi: readonly [{
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

/**
 * Creates a SystemConfig contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createSystemConfig } from '@tevm/opstack'
 * const SystemConfig = createSystemConfig()
 */
declare const createSystemConfig: (chainId?: 10) => Omit<_tevm_contract.Script<"SystemConfig", readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290";
    events: _tevm_contract.EventActionCreator<readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290">;
    read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290">;
    write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290">;
};
declare const SystemConfigAddresses: {
    readonly '10': "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290";
};
declare const SystemConfigBytecode: `0x${string}`;
declare const SystemConfigDeployedBytecode: `0x${string}`;
declare const SystemConfigHumanReadableAbi: readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"];
declare const SystemConfigAbi: readonly [{
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

/**
 * Creates a OptimismMintableERC20Factory contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createOptimismMintableERC20Factory } from '@tevm/opstack'
 * const OptimismMintableERC20Factory = createOptimismMintableERC20Factory()
 */
declare const createOptimismMintableERC20Factory: (chainId?: 10) => Omit<_tevm_contract.Script<"OptimismMintableERC20Factory", readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x75505a97BD334E7BD3C476893285569C4136Fa0F";
    events: _tevm_contract.EventActionCreator<readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"], `0x${string}`, `0x${string}`, "0x75505a97BD334E7BD3C476893285569C4136Fa0F">;
    read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"], `0x${string}`, `0x${string}`, "0x75505a97BD334E7BD3C476893285569C4136Fa0F">;
    write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"], `0x${string}`, `0x${string}`, "0x75505a97BD334E7BD3C476893285569C4136Fa0F">;
};
declare const OptimismMintableERC20FactoryAddresses: {
    readonly '10': "0x75505a97BD334E7BD3C476893285569C4136Fa0F";
};
declare const OptimismMintableERC20FactoryBytecode: `0x${string}`;
declare const OptimismMintableERC20FactoryDeployedBytecode: `0x${string}`;
declare const OptimismMintableERC20FactoryHumanReadableAbi: readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"];
declare const OptimismMintableERC20FactoryAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "BRIDGE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "bridge";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "createOptimismMintableERC20";
    readonly inputs: readonly [{
        readonly name: "_remoteToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "_symbol";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "createOptimismMintableERC20WithDecimals";
    readonly inputs: readonly [{
        readonly name: "_remoteToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "_symbol";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "_decimals";
        readonly type: "uint8";
        readonly internalType: "uint8";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "createStandardL2Token";
    readonly inputs: readonly [{
        readonly name: "_remoteToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_name";
        readonly type: "string";
        readonly internalType: "string";
    }, {
        readonly name: "_symbol";
        readonly type: "string";
        readonly internalType: "string";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_bridge";
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
    readonly name: "OptimismMintableERC20Created";
    readonly inputs: readonly [{
        readonly name: "localToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "remoteToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "deployer";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "StandardL2TokenCreated";
    readonly inputs: readonly [{
        readonly name: "remoteToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "localToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}];

/**
 * Creates a BaseFeeVault contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createBaseFeeVault } from '@tevm/opstack'
 * const BaseFeeVault = createBaseFeeVault()
 */
declare const createBaseFeeVault: (chainId?: 10) => Omit<_tevm_contract.Script<"BaseFeeVault", readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x4200000000000000000000000000000000000019";
    events: _tevm_contract.EventActionCreator<readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000019">;
    read: _tevm_contract.ReadActionCreator<readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000019">;
    write: _tevm_contract.WriteActionCreator<readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000019">;
};
declare const BaseFeeVaultAddresses: {
    readonly '10': "0x4200000000000000000000000000000000000019";
};
declare const BaseFeeVaultBytecode: `0x${string}`;
declare const BaseFeeVaultDeployedBytecode: `0x${string}`;
declare const BaseFeeVaultHumanReadableAbi: readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"];
declare const BaseFeeVaultAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_recipient";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_minWithdrawalAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_withdrawalNetwork";
        readonly type: "uint8";
        readonly internalType: "enum FeeVault.WithdrawalNetwork";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "MIN_WITHDRAWAL_AMOUNT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "RECIPIENT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "WITHDRAWAL_NETWORK";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint8";
        readonly internalType: "enum FeeVault.WithdrawalNetwork";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "totalProcessed";
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
    readonly type: "function";
    readonly name: "withdraw";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "Withdrawal";
    readonly inputs: readonly [{
        readonly name: "value";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Withdrawal";
    readonly inputs: readonly [{
        readonly name: "value";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "withdrawalNetwork";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "enum FeeVault.WithdrawalNetwork";
    }];
    readonly anonymous: false;
}];

/**
 * Creates a GasPriceOracle contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createGasPriceOracle } from '@tevm/opstack'
 * const GasPriceOracle = createGasPriceOracle()
 */
declare const createGasPriceOracle: (chainId?: 10) => Omit<_tevm_contract.Script<"GasPriceOracle", readonly ["function DECIMALS() view returns (uint256)", "function baseFee() view returns (uint256)", "function baseFeeScalar() view returns (uint32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function decimals() pure returns (uint256)", "function gasPrice() view returns (uint256)", "function getL1Fee(bytes _data) view returns (uint256)", "function getL1GasUsed(bytes _data) view returns (uint256)", "function isEcotone() view returns (bool)", "function l1BaseFee() view returns (uint256)", "function overhead() view returns (uint256)", "function scalar() view returns (uint256)", "function setEcotone()", "function version() view returns (string)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x420000000000000000000000000000000000000F";
    events: _tevm_contract.EventActionCreator<readonly ["function DECIMALS() view returns (uint256)", "function baseFee() view returns (uint256)", "function baseFeeScalar() view returns (uint32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function decimals() pure returns (uint256)", "function gasPrice() view returns (uint256)", "function getL1Fee(bytes _data) view returns (uint256)", "function getL1GasUsed(bytes _data) view returns (uint256)", "function isEcotone() view returns (bool)", "function l1BaseFee() view returns (uint256)", "function overhead() view returns (uint256)", "function scalar() view returns (uint256)", "function setEcotone()", "function version() view returns (string)"], `0x${string}`, `0x${string}`, "0x420000000000000000000000000000000000000F">;
    read: _tevm_contract.ReadActionCreator<readonly ["function DECIMALS() view returns (uint256)", "function baseFee() view returns (uint256)", "function baseFeeScalar() view returns (uint32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function decimals() pure returns (uint256)", "function gasPrice() view returns (uint256)", "function getL1Fee(bytes _data) view returns (uint256)", "function getL1GasUsed(bytes _data) view returns (uint256)", "function isEcotone() view returns (bool)", "function l1BaseFee() view returns (uint256)", "function overhead() view returns (uint256)", "function scalar() view returns (uint256)", "function setEcotone()", "function version() view returns (string)"], `0x${string}`, `0x${string}`, "0x420000000000000000000000000000000000000F">;
    write: _tevm_contract.WriteActionCreator<readonly ["function DECIMALS() view returns (uint256)", "function baseFee() view returns (uint256)", "function baseFeeScalar() view returns (uint32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function decimals() pure returns (uint256)", "function gasPrice() view returns (uint256)", "function getL1Fee(bytes _data) view returns (uint256)", "function getL1GasUsed(bytes _data) view returns (uint256)", "function isEcotone() view returns (bool)", "function l1BaseFee() view returns (uint256)", "function overhead() view returns (uint256)", "function scalar() view returns (uint256)", "function setEcotone()", "function version() view returns (string)"], `0x${string}`, `0x${string}`, "0x420000000000000000000000000000000000000F">;
};
declare const GasPriceOracleAddresses: {
    readonly '10': "0x420000000000000000000000000000000000000F";
};
declare const GasPriceOracleBytecode: `0x${string}`;
declare const GasPriceOracleDeployedBytecode: `0x${string}`;
declare const GasPriceOracleHumanReadableAbi: readonly ["function DECIMALS() view returns (uint256)", "function baseFee() view returns (uint256)", "function baseFeeScalar() view returns (uint32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function decimals() pure returns (uint256)", "function gasPrice() view returns (uint256)", "function getL1Fee(bytes _data) view returns (uint256)", "function getL1GasUsed(bytes _data) view returns (uint256)", "function isEcotone() view returns (bool)", "function l1BaseFee() view returns (uint256)", "function overhead() view returns (uint256)", "function scalar() view returns (uint256)", "function setEcotone()", "function version() view returns (string)"];
declare const GasPriceOracleAbi: readonly [{
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

/**
 * Creates a L1Block contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL1Block } from '@tevm/opstack'
 * const L1Block = createL1Block()
 */
declare const createL1Block: (chainId?: 10) => Omit<_tevm_contract.Script<"L1Block", readonly ["function DEPOSITOR_ACCOUNT() view returns (address)", "function baseFeeScalar() view returns (uint32)", "function basefee() view returns (uint256)", "function batcherHash() view returns (bytes32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function hash() view returns (bytes32)", "function l1FeeOverhead() view returns (uint256)", "function l1FeeScalar() view returns (uint256)", "function number() view returns (uint64)", "function sequenceNumber() view returns (uint64)", "function setL1BlockValues(uint64 _number, uint64 _timestamp, uint256 _basefee, bytes32 _hash, uint64 _sequenceNumber, bytes32 _batcherHash, uint256 _l1FeeOverhead, uint256 _l1FeeScalar)", "function setL1BlockValuesEcotone()", "function timestamp() view returns (uint64)", "function version() view returns (string)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x4200000000000000000000000000000000000015";
    events: _tevm_contract.EventActionCreator<readonly ["function DEPOSITOR_ACCOUNT() view returns (address)", "function baseFeeScalar() view returns (uint32)", "function basefee() view returns (uint256)", "function batcherHash() view returns (bytes32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function hash() view returns (bytes32)", "function l1FeeOverhead() view returns (uint256)", "function l1FeeScalar() view returns (uint256)", "function number() view returns (uint64)", "function sequenceNumber() view returns (uint64)", "function setL1BlockValues(uint64 _number, uint64 _timestamp, uint256 _basefee, bytes32 _hash, uint64 _sequenceNumber, bytes32 _batcherHash, uint256 _l1FeeOverhead, uint256 _l1FeeScalar)", "function setL1BlockValuesEcotone()", "function timestamp() view returns (uint64)", "function version() view returns (string)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000015">;
    read: _tevm_contract.ReadActionCreator<readonly ["function DEPOSITOR_ACCOUNT() view returns (address)", "function baseFeeScalar() view returns (uint32)", "function basefee() view returns (uint256)", "function batcherHash() view returns (bytes32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function hash() view returns (bytes32)", "function l1FeeOverhead() view returns (uint256)", "function l1FeeScalar() view returns (uint256)", "function number() view returns (uint64)", "function sequenceNumber() view returns (uint64)", "function setL1BlockValues(uint64 _number, uint64 _timestamp, uint256 _basefee, bytes32 _hash, uint64 _sequenceNumber, bytes32 _batcherHash, uint256 _l1FeeOverhead, uint256 _l1FeeScalar)", "function setL1BlockValuesEcotone()", "function timestamp() view returns (uint64)", "function version() view returns (string)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000015">;
    write: _tevm_contract.WriteActionCreator<readonly ["function DEPOSITOR_ACCOUNT() view returns (address)", "function baseFeeScalar() view returns (uint32)", "function basefee() view returns (uint256)", "function batcherHash() view returns (bytes32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function hash() view returns (bytes32)", "function l1FeeOverhead() view returns (uint256)", "function l1FeeScalar() view returns (uint256)", "function number() view returns (uint64)", "function sequenceNumber() view returns (uint64)", "function setL1BlockValues(uint64 _number, uint64 _timestamp, uint256 _basefee, bytes32 _hash, uint64 _sequenceNumber, bytes32 _batcherHash, uint256 _l1FeeOverhead, uint256 _l1FeeScalar)", "function setL1BlockValuesEcotone()", "function timestamp() view returns (uint64)", "function version() view returns (string)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000015">;
};
declare const L1BlockAddresses: {
    readonly '10': "0x4200000000000000000000000000000000000015";
};
declare const L1BlockBytecode: `0x${string}`;
declare const L1BlockDeployedBytecode: `0x${string}`;
declare const L1BlockHumanReadableAbi: readonly ["function DEPOSITOR_ACCOUNT() view returns (address)", "function baseFeeScalar() view returns (uint32)", "function basefee() view returns (uint256)", "function batcherHash() view returns (bytes32)", "function blobBaseFee() view returns (uint256)", "function blobBaseFeeScalar() view returns (uint32)", "function hash() view returns (bytes32)", "function l1FeeOverhead() view returns (uint256)", "function l1FeeScalar() view returns (uint256)", "function number() view returns (uint64)", "function sequenceNumber() view returns (uint64)", "function setL1BlockValues(uint64 _number, uint64 _timestamp, uint256 _basefee, bytes32 _hash, uint64 _sequenceNumber, bytes32 _batcherHash, uint256 _l1FeeOverhead, uint256 _l1FeeScalar)", "function setL1BlockValuesEcotone()", "function timestamp() view returns (uint64)", "function version() view returns (string)"];
declare const L1BlockAbi: readonly [{
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

/**
 * Creates a L1FeeVault contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL1FeeVault } from '@tevm/opstack'
 * const L1FeeVault = createL1FeeVault()
 */
declare const createL1FeeVault: (chainId?: 10) => Omit<_tevm_contract.Script<"L1FeeVault", readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x420000000000000000000000000000000000001a";
    events: _tevm_contract.EventActionCreator<readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"], `0x${string}`, `0x${string}`, "0x420000000000000000000000000000000000001a">;
    read: _tevm_contract.ReadActionCreator<readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"], `0x${string}`, `0x${string}`, "0x420000000000000000000000000000000000001a">;
    write: _tevm_contract.WriteActionCreator<readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"], `0x${string}`, `0x${string}`, "0x420000000000000000000000000000000000001a">;
};
declare const L1FeeVaultAddresses: {
    readonly '10': "0x420000000000000000000000000000000000001a";
};
declare const L1FeeVaultBytecode: `0x${string}`;
declare const L1FeeVaultDeployedBytecode: `0x${string}`;
declare const L1FeeVaultHumanReadableAbi: readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"];
declare const L1FeeVaultAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_recipient";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_minWithdrawalAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_withdrawalNetwork";
        readonly type: "uint8";
        readonly internalType: "enum FeeVault.WithdrawalNetwork";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "MIN_WITHDRAWAL_AMOUNT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "RECIPIENT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "WITHDRAWAL_NETWORK";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint8";
        readonly internalType: "enum FeeVault.WithdrawalNetwork";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "totalProcessed";
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
    readonly type: "function";
    readonly name: "withdraw";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "Withdrawal";
    readonly inputs: readonly [{
        readonly name: "value";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Withdrawal";
    readonly inputs: readonly [{
        readonly name: "value";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "withdrawalNetwork";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "enum FeeVault.WithdrawalNetwork";
    }];
    readonly anonymous: false;
}];

/**
 * Creates a L2CrossDomainMessenger contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL2CrossDomainMessenger } from '@tevm/opstack'
 * const L2CrossDomainMessenger = createL2CrossDomainMessenger()
 */
declare const createL2CrossDomainMessenger: (chainId?: 10) => Omit<_tevm_contract.Script<"L2CrossDomainMessenger", readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _l1CrossDomainMessenger)", "function l1CrossDomainMessenger() view returns (address)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x4200000000000000000000000000000000000007";
    events: _tevm_contract.EventActionCreator<readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _l1CrossDomainMessenger)", "function l1CrossDomainMessenger() view returns (address)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000007">;
    read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _l1CrossDomainMessenger)", "function l1CrossDomainMessenger() view returns (address)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000007">;
    write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _l1CrossDomainMessenger)", "function l1CrossDomainMessenger() view returns (address)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000007">;
};
declare const L2CrossDomainMessengerAddresses: {
    readonly '10': "0x4200000000000000000000000000000000000007";
};
declare const L2CrossDomainMessengerBytecode: `0x${string}`;
declare const L2CrossDomainMessengerDeployedBytecode: `0x${string}`;
declare const L2CrossDomainMessengerHumanReadableAbi: readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _l1CrossDomainMessenger)", "function l1CrossDomainMessenger() view returns (address)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"];
declare const L2CrossDomainMessengerAbi: readonly [{
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

/**
 * Creates a L2ERC721Bridge contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL2ERC721Bridge } from '@tevm/opstack'
 * const L2ERC721Bridge = createL2ERC721Bridge()
 */
declare const createL2ERC721Bridge: (chainId?: 10) => Omit<_tevm_contract.Script<"L2ERC721Bridge", readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _l1ERC721Bridge)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x4200000000000000000000000000000000000014";
    events: _tevm_contract.EventActionCreator<readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _l1ERC721Bridge)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000014">;
    read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _l1ERC721Bridge)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000014">;
    write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _l1ERC721Bridge)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000014">;
};
declare const L2ERC721BridgeAddresses: {
    readonly '10': "0x4200000000000000000000000000000000000014";
};
declare const L2ERC721BridgeBytecode: `0x${string}`;
declare const L2ERC721BridgeDeployedBytecode: `0x${string}`;
declare const L2ERC721BridgeHumanReadableAbi: readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _l1ERC721Bridge)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"];
declare const L2ERC721BridgeAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "MESSENGER";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract CrossDomainMessenger";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "OTHER_BRIDGE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract StandardBridge";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "bridgeERC721";
    readonly inputs: readonly [{
        readonly name: "_localToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_remoteToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_tokenId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "bridgeERC721To";
    readonly inputs: readonly [{
        readonly name: "_localToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_remoteToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_tokenId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "finalizeBridgeERC721";
    readonly inputs: readonly [{
        readonly name: "_localToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_remoteToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_from";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_tokenId";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_l1ERC721Bridge";
        readonly type: "address";
        readonly internalType: "address payable";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "messenger";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract CrossDomainMessenger";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "otherBridge";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract StandardBridge";
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
    readonly name: "ERC721BridgeFinalized";
    readonly inputs: readonly [{
        readonly name: "localToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "remoteToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "tokenId";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ERC721BridgeInitiated";
    readonly inputs: readonly [{
        readonly name: "localToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "remoteToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "tokenId";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
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
}];

/**
 * Creates a L2StandardBridge contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL2StandardBridge } from '@tevm/opstack'
 * const L2StandardBridge = createL2StandardBridge()
 */
declare const createL2StandardBridge: (chainId?: 10) => Omit<_tevm_contract.Script<"L2StandardBridge", readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeDeposit(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _otherBridge)", "function l1TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function version() view returns (string)", "function withdraw(address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "function withdrawTo(address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)", "event WithdrawalInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x4200000000000000000000000000000000000010";
    events: _tevm_contract.EventActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeDeposit(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _otherBridge)", "function l1TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function version() view returns (string)", "function withdraw(address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "function withdrawTo(address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)", "event WithdrawalInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000010">;
    read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeDeposit(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _otherBridge)", "function l1TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function version() view returns (string)", "function withdraw(address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "function withdrawTo(address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)", "event WithdrawalInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000010">;
    write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeDeposit(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _otherBridge)", "function l1TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function version() view returns (string)", "function withdraw(address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "function withdrawTo(address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)", "event WithdrawalInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000010">;
};
declare const L2StandardBridgeAddresses: {
    readonly '10': "0x4200000000000000000000000000000000000010";
};
declare const L2StandardBridgeBytecode: `0x${string}`;
declare const L2StandardBridgeDeployedBytecode: `0x${string}`;
declare const L2StandardBridgeHumanReadableAbi: readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeDeposit(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _otherBridge)", "function l1TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function version() view returns (string)", "function withdraw(address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "function withdrawTo(address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)", "event WithdrawalInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"];
declare const L2StandardBridgeAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "MESSENGER";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract CrossDomainMessenger";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "OTHER_BRIDGE";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract StandardBridge";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "bridgeERC20";
    readonly inputs: readonly [{
        readonly name: "_localToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_remoteToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "bridgeERC20To";
    readonly inputs: readonly [{
        readonly name: "_localToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_remoteToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "bridgeETH";
    readonly inputs: readonly [{
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "bridgeETHTo";
    readonly inputs: readonly [{
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "deposits";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "finalizeBridgeERC20";
    readonly inputs: readonly [{
        readonly name: "_localToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_remoteToken";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_from";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "finalizeBridgeETH";
    readonly inputs: readonly [{
        readonly name: "_from";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "finalizeDeposit";
    readonly inputs: readonly [{
        readonly name: "_l1Token";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_l2Token";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_from";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "_otherBridge";
        readonly type: "address";
        readonly internalType: "contract StandardBridge";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "l1TokenBridge";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "messenger";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract CrossDomainMessenger";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "otherBridge";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "contract StandardBridge";
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
    readonly name: "withdraw";
    readonly inputs: readonly [{
        readonly name: "_l2Token";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "withdrawTo";
    readonly inputs: readonly [{
        readonly name: "_l2Token";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_amount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_minGasLimit";
        readonly type: "uint32";
        readonly internalType: "uint32";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
        readonly internalType: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "event";
    readonly name: "DepositFinalized";
    readonly inputs: readonly [{
        readonly name: "l1Token";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "l2Token";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ERC20BridgeFinalized";
    readonly inputs: readonly [{
        readonly name: "localToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "remoteToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ERC20BridgeInitiated";
    readonly inputs: readonly [{
        readonly name: "localToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "remoteToken";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ETHBridgeFinalized";
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
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "ETHBridgeInitiated";
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
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
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
    readonly name: "WithdrawalInitiated";
    readonly inputs: readonly [{
        readonly name: "l1Token";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "l2Token";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: true;
        readonly internalType: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "extraData";
        readonly type: "bytes";
        readonly indexed: false;
        readonly internalType: "bytes";
    }];
    readonly anonymous: false;
}];

/**
 * Creates a L2ToL1MessagePasser contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL2ToL1MessagePasser } from '@tevm/opstack'
 * const L2ToL1MessagePasser = createL2ToL1MessagePasser()
 */
declare const createL2ToL1MessagePasser: (chainId?: 10) => Omit<_tevm_contract.Script<"L2ToL1MessagePasser", readonly ["receive() external payable", "function MESSAGE_VERSION() view returns (uint16)", "function burn()", "function initiateWithdrawal(address _target, uint256 _gasLimit, bytes _data) payable", "function messageNonce() view returns (uint256)", "function sentMessages(bytes32) view returns (bool)", "function version() view returns (string)", "event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)", "event WithdrawerBalanceBurnt(uint256 indexed amount)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x4200000000000000000000000000000000000016";
    events: _tevm_contract.EventActionCreator<readonly ["receive() external payable", "function MESSAGE_VERSION() view returns (uint16)", "function burn()", "function initiateWithdrawal(address _target, uint256 _gasLimit, bytes _data) payable", "function messageNonce() view returns (uint256)", "function sentMessages(bytes32) view returns (bool)", "function version() view returns (string)", "event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)", "event WithdrawerBalanceBurnt(uint256 indexed amount)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000016">;
    read: _tevm_contract.ReadActionCreator<readonly ["receive() external payable", "function MESSAGE_VERSION() view returns (uint16)", "function burn()", "function initiateWithdrawal(address _target, uint256 _gasLimit, bytes _data) payable", "function messageNonce() view returns (uint256)", "function sentMessages(bytes32) view returns (bool)", "function version() view returns (string)", "event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)", "event WithdrawerBalanceBurnt(uint256 indexed amount)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000016">;
    write: _tevm_contract.WriteActionCreator<readonly ["receive() external payable", "function MESSAGE_VERSION() view returns (uint16)", "function burn()", "function initiateWithdrawal(address _target, uint256 _gasLimit, bytes _data) payable", "function messageNonce() view returns (uint256)", "function sentMessages(bytes32) view returns (bool)", "function version() view returns (string)", "event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)", "event WithdrawerBalanceBurnt(uint256 indexed amount)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000016">;
};
declare const L2ToL1MessagePasserAddresses: {
    readonly '10': "0x4200000000000000000000000000000000000016";
};
declare const L2ToL1MessagePasserBytecode: `0x${string}`;
declare const L2ToL1MessagePasserDeployedBytecode: `0x${string}`;
declare const L2ToL1MessagePasserHumanReadableAbi: readonly ["receive() external payable", "function MESSAGE_VERSION() view returns (uint16)", "function burn()", "function initiateWithdrawal(address _target, uint256 _gasLimit, bytes _data) payable", "function messageNonce() view returns (uint256)", "function sentMessages(bytes32) view returns (bool)", "function version() view returns (string)", "event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)", "event WithdrawerBalanceBurnt(uint256 indexed amount)"];
declare const L2ToL1MessagePasserAbi: readonly [{
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

/**
 * Creates a SequencerFeeVault contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createSequencerFeeVault } from '@tevm/opstack'
 * const SequencerFeeVault = createSequencerFeeVault()
 */
declare const createSequencerFeeVault: (chainId?: 10) => Omit<_tevm_contract.Script<"SequencerFeeVault", readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function l1FeeWallet() view returns (address)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x4200000000000000000000000000000000000011";
    events: _tevm_contract.EventActionCreator<readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function l1FeeWallet() view returns (address)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000011">;
    read: _tevm_contract.ReadActionCreator<readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function l1FeeWallet() view returns (address)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000011">;
    write: _tevm_contract.WriteActionCreator<readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function l1FeeWallet() view returns (address)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000011">;
};
declare const SequencerFeeVaultAddresses: {
    readonly '10': "0x4200000000000000000000000000000000000011";
};
declare const SequencerFeeVaultBytecode: `0x${string}`;
declare const SequencerFeeVaultDeployedBytecode: `0x${string}`;
declare const SequencerFeeVaultHumanReadableAbi: readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function l1FeeWallet() view returns (address)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"];
declare const SequencerFeeVaultAbi: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [{
        readonly name: "_recipient";
        readonly type: "address";
        readonly internalType: "address";
    }, {
        readonly name: "_minWithdrawalAmount";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }, {
        readonly name: "_withdrawalNetwork";
        readonly type: "uint8";
        readonly internalType: "enum FeeVault.WithdrawalNetwork";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "receive";
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "MIN_WITHDRAWAL_AMOUNT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
        readonly internalType: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "RECIPIENT";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "WITHDRAWAL_NETWORK";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint8";
        readonly internalType: "enum FeeVault.WithdrawalNetwork";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "l1FeeWallet";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
        readonly internalType: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "totalProcessed";
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
    readonly type: "function";
    readonly name: "withdraw";
    readonly inputs: readonly [];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "Withdrawal";
    readonly inputs: readonly [{
        readonly name: "value";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }];
    readonly anonymous: false;
}, {
    readonly type: "event";
    readonly name: "Withdrawal";
    readonly inputs: readonly [{
        readonly name: "value";
        readonly type: "uint256";
        readonly indexed: false;
        readonly internalType: "uint256";
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "from";
        readonly type: "address";
        readonly indexed: false;
        readonly internalType: "address";
    }, {
        readonly name: "withdrawalNetwork";
        readonly type: "uint8";
        readonly indexed: false;
        readonly internalType: "enum FeeVault.WithdrawalNetwork";
    }];
    readonly anonymous: false;
}];

declare const constants: {
    readonly OVERHEAD: 188n;
    readonly SCALAR: 684000n;
    readonly BATCHER_HASH: "0x0000000000000000000000006887246668a3b87f54deb3b94ba47a6f63f32985";
    readonly GAS_LIMIT: 30000000n;
    readonly UNSAFE_BLOCK_SIGNER: "0xAAAA45d9549EDA09E70937013520214382Ffc4A2";
    readonly BATCH_INBOX: "0xff00000000000000000000000000000011155420";
    readonly DISPUTE_GAME_FACTORY_OWNER: `0x${string}`;
    readonly RESOURCE_METERING_RESOURCE_CONFIG: {
        readonly maxResourceLimit: 20000000;
        readonly elasticityMultiplier: 10;
        readonly baseFeeMaxChangeDenominator: 8;
        readonly minimumBaseFee: 1000000000;
        readonly systemTxMaxGas: 1000000;
        readonly maximumBaseFee: 340282366920938463463374607431768211455n;
    };
    readonly GUARDIAN: "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A";
    readonly SYSTEM_CONFIG_OWNER: "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A";
    readonly CHAIN_ID: 10;
    readonly PUBLIC_RPC: "https://mainnet.optimism.io";
    readonly SEQUENCER_RPC: "https://mainnet-sequencer.optimism.io";
    readonly EXPLORER: "https://explorer.optimism.io";
};

/**
 * Creates a Tevm client preloaded and initialized with L1 contracts. This corresponds to the 3.0 major version of Optimism
 * When possible it uses the values from mainnet. For some constants this
 * isn't possible as currently this protocol isn't deployed to a testnet or mainnet.
 *
 * All constants including vital OP stack addresses and owners are available and transactions may be sent mocking them using tevm `to` property.
 */
declare const createL1Client: ({ chainId }?: {
    chainId?: 10;
}) => {
    op: {
        OVERHEAD: 188n;
        SCALAR: 684000n;
        BATCHER_HASH: "0x0000000000000000000000006887246668a3b87f54deb3b94ba47a6f63f32985";
        GAS_LIMIT: 30000000n;
        UNSAFE_BLOCK_SIGNER: "0xAAAA45d9549EDA09E70937013520214382Ffc4A2";
        BATCH_INBOX: "0xff00000000000000000000000000000011155420";
        DISPUTE_GAME_FACTORY_OWNER: `0x${string}`;
        RESOURCE_METERING_RESOURCE_CONFIG: {
            readonly maxResourceLimit: 20000000;
            readonly elasticityMultiplier: 10;
            readonly baseFeeMaxChangeDenominator: 8;
            readonly minimumBaseFee: 1000000000;
            readonly systemTxMaxGas: 1000000;
            readonly maximumBaseFee: 340282366920938463463374607431768211455n;
        };
        GUARDIAN: "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A";
        SYSTEM_CONFIG_OWNER: "0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A";
        CHAIN_ID: 10;
        PUBLIC_RPC: "https://mainnet.optimism.io";
        SEQUENCER_RPC: "https://mainnet-sequencer.optimism.io";
        EXPLORER: "https://explorer.optimism.io";
        L1Erc721Bridge: Omit<_tevm_contract.Script<"L1ERC721Bridge", readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"]>, "address" | "events" | "read" | "write"> & {
            address: "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D";
            events: _tevm_contract.EventActionCreator<readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D">;
            read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D">;
            write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D">;
        };
        SuperchainConfig: Omit<_tevm_contract.Script<"SuperchainConfig", readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"]>, "address" | "events" | "read" | "write"> & {
            address: "0x6902690269026902690269026902690269026902";
            events: _tevm_contract.EventActionCreator<readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"], `0x${string}`, `0x${string}`, "0x6902690269026902690269026902690269026902">;
            read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"], `0x${string}`, `0x${string}`, "0x6902690269026902690269026902690269026902">;
            write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "function GUARDIAN_SLOT() view returns (bytes32)", "function PAUSED_SLOT() view returns (bytes32)", "function guardian() view returns (address guardian_)", "function initialize(address _guardian, bool _paused)", "function pause(string _identifier)", "function paused() view returns (bool paused_)", "function unpause()", "function version() view returns (string)", "event ConfigUpdate(uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event Paused(string identifier)", "event Unpaused()"], `0x${string}`, `0x${string}`, "0x6902690269026902690269026902690269026902">;
        };
        L1CrossDomainMessenger: Omit<_tevm_contract.Script<"L1CrossDomainMessenger", readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function PORTAL() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _superchainConfig, address _portal)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function portal() view returns (address)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"]>, "address" | "events" | "read" | "write"> & {
            address: "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1";
            events: _tevm_contract.EventActionCreator<readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function PORTAL() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _superchainConfig, address _portal)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function portal() view returns (address)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"], `0x${string}`, `0x${string}`, "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1">;
            read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function PORTAL() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _superchainConfig, address _portal)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function portal() view returns (address)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"], `0x${string}`, `0x${string}`, "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1">;
            write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "function MESSAGE_VERSION() view returns (uint16)", "function MIN_GAS_CALLDATA_OVERHEAD() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_DENOMINATOR() view returns (uint64)", "function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() view returns (uint64)", "function OTHER_MESSENGER() view returns (address)", "function PORTAL() view returns (address)", "function RELAY_CALL_OVERHEAD() view returns (uint64)", "function RELAY_CONSTANT_OVERHEAD() view returns (uint64)", "function RELAY_GAS_CHECK_BUFFER() view returns (uint64)", "function RELAY_RESERVED_GAS() view returns (uint64)", "function baseGas(bytes _message, uint32 _minGasLimit) pure returns (uint64)", "function failedMessages(bytes32) view returns (bool)", "function initialize(address _superchainConfig, address _portal)", "function messageNonce() view returns (uint256)", "function otherMessenger() view returns (address)", "function paused() view returns (bool)", "function portal() view returns (address)", "function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes _message) payable", "function sendMessage(address _target, bytes _message, uint32 _minGasLimit) payable", "function successfulMessages(bytes32) view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "function xDomainMessageSender() view returns (address)", "event FailedRelayedMessage(bytes32 indexed msgHash)", "event Initialized(uint8 version)", "event RelayedMessage(bytes32 indexed msgHash)", "event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)", "event SentMessageExtension1(address indexed sender, uint256 value)"], `0x${string}`, `0x${string}`, "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1">;
        };
        L1StandardBridge: Omit<_tevm_contract.Script<"L1StandardBridge", readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"]>, "address" | "events" | "read" | "write"> & {
            address: "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1";
            events: _tevm_contract.EventActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1">;
            read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1">;
            write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1">;
        };
        L2OutputOracle: Omit<_tevm_contract.Script<"L2OutputOracle", readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"]>, "address" | "events" | "read" | "write"> & {
            address: "0xdfe97868233d1aa22e815a266982f2cf17685a27";
            events: _tevm_contract.EventActionCreator<readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"], `0x${string}`, `0x${string}`, "0xdfe97868233d1aa22e815a266982f2cf17685a27">;
            read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"], `0x${string}`, `0x${string}`, "0xdfe97868233d1aa22e815a266982f2cf17685a27">;
            write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "function CHALLENGER() view returns (address)", "function FINALIZATION_PERIOD_SECONDS() view returns (uint256)", "function L2_BLOCK_TIME() view returns (uint256)", "function PROPOSER() view returns (address)", "function SUBMISSION_INTERVAL() view returns (uint256)", "function challenger() view returns (address)", "function computeL2Timestamp(uint256 _l2BlockNumber) view returns (uint256)", "function deleteL2Outputs(uint256 _l2OutputIndex)", "function finalizationPeriodSeconds() view returns (uint256)", "function getL2Output(uint256 _l2OutputIndex) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputAfter(uint256 _l2BlockNumber) view returns ((bytes32 outputRoot, uint128 timestamp, uint128 l2BlockNumber))", "function getL2OutputIndexAfter(uint256 _l2BlockNumber) view returns (uint256)", "function initialize(uint256 _submissionInterval, uint256 _l2BlockTime, uint256 _startingBlockNumber, uint256 _startingTimestamp, address _proposer, address _challenger, uint256 _finalizationPeriodSeconds)", "function l2BlockTime() view returns (uint256)", "function latestBlockNumber() view returns (uint256)", "function latestOutputIndex() view returns (uint256)", "function nextBlockNumber() view returns (uint256)", "function nextOutputIndex() view returns (uint256)", "function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber) payable", "function proposer() view returns (address)", "function startingBlockNumber() view returns (uint256)", "function startingTimestamp() view returns (uint256)", "function submissionInterval() view returns (uint256)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OutputProposed(bytes32 indexed outputRoot, uint256 indexed l2OutputIndex, uint256 indexed l2BlockNumber, uint256 l1Timestamp)", "event OutputsDeleted(uint256 indexed prevNextOutputIndex, uint256 indexed newNextOutputIndex)"], `0x${string}`, `0x${string}`, "0xdfe97868233d1aa22e815a266982f2cf17685a27">;
        };
        OptimismPortal2: Omit<_tevm_contract.Script<"OptimismPortal2", readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"]>, "address" | "events" | "read" | "write"> & {
            address: "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed";
            events: _tevm_contract.EventActionCreator<readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"], `0x${string}`, `0x${string}`, "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed">;
            read: _tevm_contract.ReadActionCreator<readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"], `0x${string}`, `0x${string}`, "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed">;
            write: _tevm_contract.WriteActionCreator<readonly ["constructor(uint256 _proofMaturityDelaySeconds, uint256 _disputeGameFinalityDelaySeconds, uint32 _initialRespectedGameType)", "receive() external payable", "function GUARDIAN() view returns (address)", "function SYSTEM_CONFIG() view returns (address)", "function blacklistDisputeGame(address _disputeGame)", "function checkWithdrawal(bytes32 _withdrawalHash) view", "function deleteProvenWithdrawal(bytes32 _withdrawalHash)", "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data) payable", "function disputeGameBlacklist(address) view returns (bool)", "function disputeGameFactory() view returns (address)", "function donateETH() payable", "function finalizeWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx)", "function finalizedWithdrawals(bytes32) view returns (bool)", "function guardian() view returns (address)", "function initialize(address _disputeGameFactory, address _systemConfig, address _superchainConfig)", "function l2Sender() view returns (address)", "function minimumGasLimit(uint64 _byteCount) pure returns (uint64)", "function params() view returns (uint128 prevBaseFee, uint64 prevBoughtGas, uint64 prevBlockNum)", "function paused() view returns (bool paused_)", "function proveWithdrawalTransaction((uint256 nonce, address sender, address target, uint256 value, uint256 gasLimit, bytes data) _tx, uint256 _disputeGameIndex, (bytes32 version, bytes32 stateRoot, bytes32 messagePasserStorageRoot, bytes32 latestBlockhash) _outputRootProof, bytes[] _withdrawalProof)", "function provenWithdrawals(bytes32) view returns (address disputeGameProxy, uint64 timestamp)", "function respectedGameType() view returns (uint32)", "function setRespectedGameType(uint32 _gameType)", "function superchainConfig() view returns (address)", "function systemConfig() view returns (address)", "function version() view returns (string)", "event Initialized(uint8 version)", "event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)", "event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)", "event WithdrawalProven(bytes32 indexed withdrawalHash, address indexed from, address indexed to)"], `0x${string}`, `0x${string}`, "0xbEb5Fc579115071764c7423A4f12eDde41f106Ed">;
        };
        DisputeGameFactory: Omit<_tevm_contract.Script<"DisputeGameFactory", readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"]>, "address" | "events" | "read" | "write"> & {
            address: "0x6901690169016901690169016901690169016901";
            events: _tevm_contract.EventActionCreator<readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"], `0x${string}`, `0x${string}`, "0x6901690169016901690169016901690169016901">;
            read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"], `0x${string}`, `0x${string}`, "0x6901690169016901690169016901690169016901">;
            write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"], `0x${string}`, `0x${string}`, "0x6901690169016901690169016901690169016901">;
        };
        SystemConfig: Omit<_tevm_contract.Script<"SystemConfig", readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"]>, "address" | "events" | "read" | "write"> & {
            address: "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290";
            events: _tevm_contract.EventActionCreator<readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290">;
            read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290">;
            write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "function BATCH_INBOX_SLOT() view returns (bytes32)", "function L1_CROSS_DOMAIN_MESSENGER_SLOT() view returns (bytes32)", "function L1_ERC_721_BRIDGE_SLOT() view returns (bytes32)", "function L1_STANDARD_BRIDGE_SLOT() view returns (bytes32)", "function L2_OUTPUT_ORACLE_SLOT() view returns (bytes32)", "function OPTIMISM_MINTABLE_ERC20_FACTORY_SLOT() view returns (bytes32)", "function OPTIMISM_PORTAL_SLOT() view returns (bytes32)", "function START_BLOCK_SLOT() view returns (bytes32)", "function UNSAFE_BLOCK_SIGNER_SLOT() view returns (bytes32)", "function VERSION() view returns (uint256)", "function batchInbox() view returns (address addr_)", "function batcherHash() view returns (bytes32)", "function gasLimit() view returns (uint64)", "function initialize(address _owner, uint256 _overhead, uint256 _scalar, bytes32 _batcherHash, uint64 _gasLimit, address _unsafeBlockSigner, (uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config, address _batchInbox, (address l1CrossDomainMessenger, address l1ERC721Bridge, address l1StandardBridge, address l2OutputOracle, address optimismPortal, address optimismMintableERC20Factory) _addresses)", "function l1CrossDomainMessenger() view returns (address addr_)", "function l1ERC721Bridge() view returns (address addr_)", "function l1StandardBridge() view returns (address addr_)", "function l2OutputOracle() view returns (address addr_)", "function minimumGasLimit() view returns (uint64)", "function optimismMintableERC20Factory() view returns (address addr_)", "function optimismPortal() view returns (address addr_)", "function overhead() view returns (uint256)", "function owner() view returns (address)", "function renounceOwnership()", "function resourceConfig() view returns ((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee))", "function scalar() view returns (uint256)", "function setBatcherHash(bytes32 _batcherHash)", "function setGasConfig(uint256 _overhead, uint256 _scalar)", "function setGasLimit(uint64 _gasLimit)", "function setResourceConfig((uint32 maxResourceLimit, uint8 elasticityMultiplier, uint8 baseFeeMaxChangeDenominator, uint32 minimumBaseFee, uint32 systemTxMaxGas, uint128 maximumBaseFee) _config)", "function setUnsafeBlockSigner(address _unsafeBlockSigner)", "function startBlock() view returns (uint256 startBlock_)", "function transferOwnership(address newOwner)", "function unsafeBlockSigner() view returns (address addr_)", "function version() view returns (string)", "event ConfigUpdate(uint256 indexed version, uint8 indexed updateType, bytes data)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"], `0x${string}`, `0x${string}`, "0x229047fed2591dbec1eF1118d64F7aF3dB9EB290">;
        };
        OptimismMintableERC20Factory: Omit<_tevm_contract.Script<"OptimismMintableERC20Factory", readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"]>, "address" | "events" | "read" | "write"> & {
            address: "0x75505a97BD334E7BD3C476893285569C4136Fa0F";
            events: _tevm_contract.EventActionCreator<readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"], `0x${string}`, `0x${string}`, "0x75505a97BD334E7BD3C476893285569C4136Fa0F">;
            read: _tevm_contract.ReadActionCreator<readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"], `0x${string}`, `0x${string}`, "0x75505a97BD334E7BD3C476893285569C4136Fa0F">;
            write: _tevm_contract.WriteActionCreator<readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"], `0x${string}`, `0x${string}`, "0x75505a97BD334E7BD3C476893285569C4136Fa0F">;
        };
    };
    tevmReady: () => Promise<true>;
    account: undefined;
    batch?: {
        multicall?: boolean | {
            batchSize?: number | undefined;
            wait?: number | undefined;
        } | undefined;
    } | undefined;
    cacheTime: number;
    ccipRead?: false | {
        request?: (parameters: viem.CcipRequestParameters) => Promise<`0x${string}`>;
    } | undefined;
    chain: undefined;
    key: string;
    name: string;
    pollingInterval: number;
    request: viem.EIP1193RequestFn<[{
        Method: "web3_clientVersion";
        Parameters?: undefined;
        ReturnType: string;
    }, {
        Method: "web3_sha3";
        Parameters: [data: `0x${string}`];
        ReturnType: string;
    }, {
        Method: "net_listening";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "net_peerCount";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "net_version";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_blobBaseFee";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_blockNumber";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_call";
        Parameters: [transaction: viem.ExactPartial<viem.RpcTransactionRequest>] | [transaction: viem.ExactPartial<viem.RpcTransactionRequest>, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier] | [transaction: viem.ExactPartial<viem.RpcTransactionRequest>, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier, stateOverrideSet: viem.RpcStateOverride];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_chainId";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_coinbase";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_estimateGas";
        Parameters: [transaction: viem.RpcTransactionRequest] | [transaction: viem.RpcTransactionRequest, block: `0x${string}` | viem.BlockTag] | [transaction: viem.RpcTransactionRequest, block: `0x${string}` | viem.BlockTag, viem.RpcStateOverride];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_feeHistory";
        Parameters: [blockCount: `0x${string}`, newestBlock: `0x${string}` | viem.BlockTag, rewardPercentiles: number[] | undefined];
        ReturnType: viem.RpcFeeHistory;
    }, {
        Method: "eth_gasPrice";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBalance";
        Parameters: [address: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBlockByHash";
        Parameters: [hash: `0x${string}`, includeTransactionObjects: boolean];
        ReturnType: viem.RpcBlock | null;
    }, {
        Method: "eth_getBlockByNumber";
        Parameters: [block: `0x${string}` | viem.BlockTag, includeTransactionObjects: boolean];
        ReturnType: viem.RpcBlock | null;
    }, {
        Method: "eth_getBlockTransactionCountByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBlockTransactionCountByNumber";
        Parameters: [block: `0x${string}` | viem.BlockTag];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getCode";
        Parameters: [address: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getFilterChanges";
        Parameters: [filterId: `0x${string}`];
        ReturnType: `0x${string}`[] | viem.RpcLog[];
    }, {
        Method: "eth_getFilterLogs";
        Parameters: [filterId: `0x${string}`];
        ReturnType: viem.RpcLog[];
    }, {
        Method: "eth_getLogs";
        Parameters: [{
            address?: `0x${string}` | `0x${string}`[] | undefined;
            topics?: viem.LogTopic[] | undefined;
        } & ({
            fromBlock?: `0x${string}` | viem.BlockTag | undefined;
            toBlock?: `0x${string}` | viem.BlockTag | undefined;
            blockHash?: undefined;
        } | {
            fromBlock?: undefined;
            toBlock?: undefined;
            blockHash?: `0x${string}` | undefined;
        })];
        ReturnType: viem.RpcLog[];
    }, {
        Method: "eth_getProof";
        Parameters: [address: `0x${string}`, storageKeys: `0x${string}`[], block: `0x${string}` | viem.BlockTag];
        ReturnType: viem.RpcProof;
    }, {
        Method: "eth_getStorageAt";
        Parameters: [address: `0x${string}`, index: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getTransactionByBlockHashAndIndex";
        Parameters: [hash: `0x${string}`, index: `0x${string}`];
        ReturnType: viem.RpcTransaction | null;
    }, {
        Method: "eth_getTransactionByBlockNumberAndIndex";
        Parameters: [block: `0x${string}` | viem.BlockTag, index: `0x${string}`];
        ReturnType: viem.RpcTransaction | null;
    }, {
        Method: "eth_getTransactionByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: viem.RpcTransaction | null;
    }, {
        Method: "eth_getTransactionCount";
        Parameters: [address: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getTransactionReceipt";
        Parameters: [hash: `0x${string}`];
        ReturnType: viem.RpcTransactionReceipt | null;
    }, {
        Method: "eth_getUncleByBlockHashAndIndex";
        Parameters: [hash: `0x${string}`, index: `0x${string}`];
        ReturnType: viem.RpcUncle | null;
    }, {
        Method: "eth_getUncleByBlockNumberAndIndex";
        Parameters: [block: `0x${string}` | viem.BlockTag, index: `0x${string}`];
        ReturnType: viem.RpcUncle | null;
    }, {
        Method: "eth_getUncleCountByBlockHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getUncleCountByBlockNumber";
        Parameters: [block: `0x${string}` | viem.BlockTag];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_maxPriorityFeePerGas";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newBlockFilter";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newFilter";
        Parameters: [filter: {
            fromBlock?: `0x${string}` | viem.BlockTag | undefined;
            toBlock?: `0x${string}` | viem.BlockTag | undefined;
            address?: `0x${string}` | `0x${string}`[] | undefined;
            topics?: viem.LogTopic[] | undefined;
        }];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newPendingTransactionFilter";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_protocolVersion";
        Parameters?: undefined;
        ReturnType: string;
    }, {
        Method: "eth_sendRawTransaction";
        Parameters: [signedTransaction: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_uninstallFilter";
        Parameters: [filterId: `0x${string}`];
        ReturnType: boolean;
    }, {
        Method: "anvil_addCompilationResult" | "ganache_addCompilationResult" | "hardhat_addCompilationResult";
        Parameters: any[];
        ReturnType: any;
    }, {
        Method: "anvil_dropTransaction" | "ganache_dropTransaction" | "hardhat_dropTransaction";
        Parameters: [hash: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_dumpState" | "ganache_dumpState" | "hardhat_dumpState";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "anvil_enableTraces" | "ganache_enableTraces" | "hardhat_enableTraces";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "anvil_impersonateAccount" | "ganache_impersonateAccount" | "hardhat_impersonateAccount";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_getAutomine" | "ganache_getAutomine" | "hardhat_getAutomine";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "anvil_loadState" | "ganache_loadState" | "hardhat_loadState";
        Parameters?: [`0x${string}`] | undefined;
        ReturnType: void;
    }, {
        Method: "anvil_mine" | "ganache_mine" | "hardhat_mine";
        Parameters: [count: `0x${string}`, interval: `0x${string}` | undefined];
        ReturnType: void;
    }, {
        Method: "anvil_reset" | "ganache_reset" | "hardhat_reset";
        Parameters: any[];
        ReturnType: void;
    }, {
        Method: "anvil_setBalance" | "ganache_setBalance" | "hardhat_setBalance";
        Parameters: [address: `0x${string}`, balance: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setCode" | "ganache_setCode" | "hardhat_setCode";
        Parameters: [address: `0x${string}`, data: string];
        ReturnType: void;
    }, {
        Method: "anvil_setCoinbase" | "ganache_setCoinbase" | "hardhat_setCoinbase";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setLoggingEnabled" | "ganache_setLoggingEnabled" | "hardhat_setLoggingEnabled";
        Parameters: [enabled: boolean];
        ReturnType: void;
    }, {
        Method: "anvil_setMinGasPrice" | "ganache_setMinGasPrice" | "hardhat_setMinGasPrice";
        Parameters: [gasPrice: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setNextBlockBaseFeePerGas" | "ganache_setNextBlockBaseFeePerGas" | "hardhat_setNextBlockBaseFeePerGas";
        Parameters: [baseFeePerGas: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setNonce" | "ganache_setNonce" | "hardhat_setNonce";
        Parameters: [address: `0x${string}`, nonce: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setRpcUrl" | "ganache_setRpcUrl" | "hardhat_setRpcUrl";
        Parameters: [url: string];
        ReturnType: void;
    }, {
        Method: "anvil_setStorageAt" | "ganache_setStorageAt" | "hardhat_setStorageAt";
        Parameters: [address: `0x${string}`, index: `0x${string}`, value: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_stopImpersonatingAccount" | "ganache_stopImpersonatingAccount" | "hardhat_stopImpersonatingAccount";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_increaseTime" | "ganache_increaseTime" | "hardhat_increaseTime";
        Parameters: [seconds: number];
        ReturnType: `0x${string}`;
    }, {
        Method: "evm_setAccountBalance";
        Parameters: [address: `0x${string}`, value: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_setAutomine";
        Parameters: [boolean];
        ReturnType: void;
    }, {
        Method: "evm_setBlockGasLimit";
        Parameters: [gasLimit: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_increaseTime";
        Parameters: [seconds: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "anvil_setBlockTimestampInterval" | "ganache_setBlockTimestampInterval" | "hardhat_setBlockTimestampInterval";
        Parameters: [seconds: number];
        ReturnType: void;
    }, {
        Method: "anvil_removeBlockTimestampInterval" | "ganache_removeBlockTimestampInterval" | "hardhat_removeBlockTimestampInterval";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "evm_setIntervalMining";
        Parameters: [number];
        ReturnType: void;
    }, {
        Method: "evm_setNextBlockTimestamp";
        Parameters: [`0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_snapshot";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "evm_revert";
        Parameters?: [id: `0x${string}`] | undefined;
        ReturnType: void;
    }, {
        Method: "miner_start";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "miner_stop";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "txpool_content";
        Parameters?: undefined;
        ReturnType: {
            pending: Record<`0x${string}`, Record<string, viem.RpcTransaction>>;
            queued: Record<`0x${string}`, Record<string, viem.RpcTransaction>>;
        };
    }, {
        Method: "txpool_inspect";
        Parameters?: undefined;
        ReturnType: {
            pending: Record<`0x${string}`, Record<string, string>>;
            queued: Record<`0x${string}`, Record<string, string>>;
        };
    }, {
        Method: "txpool_status";
        Parameters?: undefined;
        ReturnType: {
            pending: `0x${string}`;
            queued: `0x${string}`;
        };
    }, {
        Method: "eth_mining";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "evm_mine";
        Parameters?: [{
            blocks: `0x${string}`;
        }] | undefined;
        ReturnType: void;
    }, {
        Method: "eth_sendUnsignedTransaction";
        Parameters: [transaction: viem.RpcTransactionRequest];
        ReturnType: `0x${string}`;
    }, {
        Method: "tevm_call";
        Parameters: [params: {
            data?: `0x${string}`;
            deployedBytecode?: `0x${string}`;
            value?: `0x${string}`;
            from?: `0x${string}`;
            to?: `0x${string}`;
            gasPrice?: `0x${string}`;
            gas?: `0x${string}`;
            blobVersionedHashes?: `0x${string}`[];
            blockTag?: `0x${string}` | _tevm_actions_types.BlockTag;
            gasRefund?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            throwOnFail?: boolean;
            createTrace?: boolean;
            createAccessList?: boolean;
            createTransaction?: boolean | "on-success" | "always" | "never";
            skipBalance?: boolean;
            origin?: `0x${string}`;
            caller?: `0x${string}`;
            depth?: number;
            salt?: `0x${string}`;
        }, stateOverrideSet?: {
            [x: `0x${string}`]: {
                balance?: `0x${string}`;
                nonce?: `0x${string}`;
                code?: `0x${string}`;
                state?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
                stateDiff?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
            };
        } | undefined, blockOverrideSet?: {
            number?: `0x${string}`;
            time?: `0x${string}`;
            gasLimit?: `0x${string}`;
            coinbase?: `0x${string}`;
            baseFee?: `0x${string}`;
            blobBaseFee?: `0x${string}`;
        } | undefined];
        ReturnType: {
            trace?: {
                readonly failed: boolean;
                readonly gas: `0x${string}`;
                readonly returnValue: `0x${string}`;
                readonly structLogs: {
                    readonly depth: number;
                    readonly gas: `0x${string}`;
                    readonly gasCost: `0x${string}`;
                    readonly op: string;
                    readonly pc: number;
                    readonly stack: `0x${string}`[];
                    readonly error?: {
                        error: string;
                        errorType: string;
                    };
                }[];
            };
            accessList?: {
                [x: `0x${string}`]: readonly `0x${string}`[];
            };
            txHash?: `0x${string}`;
            gas?: `0x${string}`;
            executionGasUsed: `0x${string}`;
            logs?: {
                readonly address: `0x${string}`;
                readonly topics: `0x${string}`[];
                readonly data: `0x${string}`;
            }[];
            gasRefund?: `0x${string}`;
            blobGasUsed?: `0x${string}`;
            createdAddress?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            createdAddresses?: readonly `0x${string}`[];
            rawData: `0x${string}`;
            errors?: never[];
        };
    }, {
        Method: "tevm_script";
        Parameters: [params: {
            value?: `0x${string}`;
            from?: `0x${string}`;
            to?: `0x${string}`;
            gasPrice?: `0x${string}`;
            gas?: `0x${string}`;
            blobVersionedHashes?: `0x${string}`[];
            blockTag?: `0x${string}` | _tevm_actions_types.BlockTag;
            gasRefund?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            throwOnFail?: boolean;
            createTrace?: boolean;
            createAccessList?: boolean;
            createTransaction?: boolean | "on-success" | "always" | "never";
            skipBalance?: boolean;
            origin?: `0x${string}`;
            caller?: `0x${string}`;
            depth?: number;
        } & {
            data: `0x${string}`;
            deployedBytecode: `0x${string}`;
        }, stateOverrideSet?: {
            [x: `0x${string}`]: {
                balance?: `0x${string}`;
                nonce?: `0x${string}`;
                code?: `0x${string}`;
                state?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
                stateDiff?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
            };
        } | undefined, blockOverrideSet?: {
            number?: `0x${string}`;
            time?: `0x${string}`;
            gasLimit?: `0x${string}`;
            coinbase?: `0x${string}`;
            baseFee?: `0x${string}`;
            blobBaseFee?: `0x${string}`;
        } | undefined];
        ReturnType: {
            trace?: {
                readonly failed: boolean;
                readonly gas: `0x${string}`;
                readonly returnValue: `0x${string}`;
                readonly structLogs: {
                    readonly depth: number;
                    readonly gas: `0x${string}`;
                    readonly gasCost: `0x${string}`;
                    readonly op: string;
                    readonly pc: number;
                    readonly stack: `0x${string}`[];
                    readonly error?: {
                        error: string;
                        errorType: string;
                    };
                }[];
            };
            accessList?: {
                [x: `0x${string}`]: readonly `0x${string}`[];
            };
            txHash?: `0x${string}`;
            gas?: `0x${string}`;
            executionGasUsed: `0x${string}`;
            logs?: {
                readonly address: `0x${string}`;
                readonly topics: `0x${string}`[];
                readonly data: `0x${string}`;
            }[];
            gasRefund?: `0x${string}`;
            blobGasUsed?: `0x${string}`;
            createdAddress?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            createdAddresses?: readonly `0x${string}`[];
            rawData: `0x${string}`;
            errors?: never[];
        };
    }, {
        Method: "tevm_dumpState";
        Parameters?: [] | undefined;
        ReturnType: _tevm_actions_types.DumpStateResult<never>;
    }, {
        Method: "tevm_loadState";
        Parameters: [_tevm_procedures_types.SerializedParams];
        ReturnType: {
            errors?: never[];
        };
    }, {
        Method: "tevm_getAccount";
        Parameters: [{
            throwOnFail?: boolean;
            address: `0x${string}`;
            returnStorage?: boolean;
        }];
        ReturnType: {
            errors?: never[];
            address: `0x${string}`;
            nonce: `0x${string}`;
            balance: `0x${string}`;
            deployedBytecode: `0x${string}`;
            storageRoot: `0x${string}`;
            codeHash: `0x${string}`;
            isContract: boolean;
            isEmpty: boolean;
            storage?: {
                [x: `0x${string}`]: `0x${string}`;
            };
        };
    }, {
        Method: "tevm_setAccount";
        Parameters: [{
            throwOnFail?: boolean;
            address: `0x${string}`;
            nonce?: `0x${string}`;
            balance?: `0x${string}`;
            deployedBytecode?: `0x${string}`;
            storageRoot?: `0x${string}`;
            state?: {
                [x: `0x${string}`]: `0x${string}`;
            };
            stateDiff?: {
                [x: `0x${string}`]: `0x${string}`;
            };
        }];
        ReturnType: {
            errors?: never[];
        };
    }]>;
    transport: viem.TransportConfig<string, viem.EIP1193RequestFn> & Record<string, any>;
    type: string;
    uid: string;
    call: (parameters: viem.CallParameters<viem.Chain | undefined>) => Promise<viem.CallReturnType>;
    createBlockFilter: () => Promise<{
        id: `0x${string}`;
        request: viem.EIP1193RequestFn<readonly [{
            Method: "eth_getFilterChanges";
            Parameters: [filterId: `0x${string}`];
            ReturnType: `0x${string}`[] | viem.RpcLog[];
        }, {
            Method: "eth_getFilterLogs";
            Parameters: [filterId: `0x${string}`];
            ReturnType: viem.RpcLog[];
        }, {
            Method: "eth_uninstallFilter";
            Parameters: [filterId: `0x${string}`];
            ReturnType: boolean;
        }]>;
        type: "block";
    }>;
    createContractEventFilter: <const TAbi extends viem.Abi | readonly unknown[], TEventName extends viem.ContractEventName<TAbi> | undefined, TArgs extends viem.MaybeExtractEventArgsFromAbi<TAbi, TEventName> | undefined, TStrict extends boolean | undefined = undefined, TFromBlock extends bigint | viem.BlockTag | undefined = undefined, TToBlock extends bigint | viem.BlockTag | undefined = undefined>(args: viem.CreateContractEventFilterParameters<TAbi, TEventName, TArgs, TStrict, TFromBlock, TToBlock>) => Promise<viem.CreateContractEventFilterReturnType<TAbi, TEventName, TArgs, TStrict, TFromBlock, TToBlock>>;
    createEventFilter: <const TAbiEvent extends viem.AbiEvent | undefined = undefined, const TAbiEvents extends readonly unknown[] | readonly viem.AbiEvent[] | undefined = TAbiEvent extends viem.AbiEvent ? [TAbiEvent] : undefined, TStrict_1 extends boolean | undefined = undefined, TFromBlock_1 extends bigint | viem.BlockTag | undefined = undefined, TToBlock_1 extends bigint | viem.BlockTag | undefined = undefined, _EventName extends string | undefined = viem.MaybeAbiEventName<TAbiEvent>, _Args extends viem.MaybeExtractEventArgsFromAbi<TAbiEvents, _EventName> | undefined = undefined>(args?: viem.CreateEventFilterParameters<TAbiEvent, TAbiEvents, TStrict_1, TFromBlock_1, TToBlock_1, _EventName, _Args> | undefined) => Promise<viem.Filter<"event", TAbiEvents, _EventName, _Args, TStrict_1, TFromBlock_1, TToBlock_1> extends infer T ? { [K in keyof T]: viem.Filter<"event", TAbiEvents, _EventName, _Args, TStrict_1, TFromBlock_1, TToBlock_1>[K]; } : never>;
    createPendingTransactionFilter: () => Promise<{
        id: `0x${string}`;
        request: viem.EIP1193RequestFn<readonly [{
            Method: "eth_getFilterChanges";
            Parameters: [filterId: `0x${string}`];
            ReturnType: `0x${string}`[] | viem.RpcLog[];
        }, {
            Method: "eth_getFilterLogs";
            Parameters: [filterId: `0x${string}`];
            ReturnType: viem.RpcLog[];
        }, {
            Method: "eth_uninstallFilter";
            Parameters: [filterId: `0x${string}`];
            ReturnType: boolean;
        }]>;
        type: "transaction";
    }>;
    estimateContractGas: <TChain extends viem.Chain | undefined, const abi extends viem.Abi | readonly unknown[], functionName extends viem.ContractFunctionName<abi, "nonpayable" | "payable">, args extends viem.ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>>(args: viem.EstimateContractGasParameters<abi, functionName, args, TChain>) => Promise<bigint>;
    estimateGas: (args: viem.EstimateGasParameters<viem.Chain | undefined>) => Promise<bigint>;
    getBalance: (args: viem.GetBalanceParameters) => Promise<bigint>;
    getBlobBaseFee: () => Promise<bigint>;
    getBlock: <TIncludeTransactions extends boolean = false, TBlockTag extends viem.BlockTag = "latest">(args?: viem.GetBlockParameters<TIncludeTransactions, TBlockTag> | undefined) => Promise<{
        number: TBlockTag extends "pending" ? null : bigint;
        gasLimit: bigint;
        extraData: `0x${string}`;
        timestamp: bigint;
        nonce: TBlockTag extends "pending" ? null : `0x${string}`;
        stateRoot: `0x${string}`;
        hash: TBlockTag extends "pending" ? null : `0x${string}`;
        blobGasUsed: bigint;
        logsBloom: TBlockTag extends "pending" ? null : `0x${string}`;
        baseFeePerGas: bigint | null;
        difficulty: bigint;
        excessBlobGas: bigint;
        gasUsed: bigint;
        miner: `0x${string}`;
        mixHash: `0x${string}`;
        parentHash: `0x${string}`;
        receiptsRoot: `0x${string}`;
        sealFields: `0x${string}`[];
        sha3Uncles: `0x${string}`;
        size: bigint;
        totalDifficulty: bigint | null;
        transactionsRoot: `0x${string}`;
        uncles: `0x${string}`[];
        withdrawals?: viem.Withdrawal[] | undefined;
        withdrawalsRoot?: `0x${string}` | undefined;
        transactions: TIncludeTransactions extends true ? ({
            value: bigint;
            from: `0x${string}`;
            to: `0x${string}` | null;
            nonce: number;
            gasPrice: bigint;
            hash: `0x${string}`;
            chainId?: number | undefined;
            type: "legacy";
            yParity?: undefined;
            gas: bigint;
            input: `0x${string}`;
            r: `0x${string}`;
            s: `0x${string}`;
            typeHex: `0x${string}` | null;
            v: bigint;
            maxFeePerBlobGas?: undefined;
            maxFeePerGas?: undefined;
            maxPriorityFeePerGas?: undefined;
            accessList?: undefined;
            blobVersionedHashes?: undefined;
            blockHash: (TBlockTag extends "pending" ? true : false) extends infer T_1 ? T_1 extends (TBlockTag extends "pending" ? true : false) ? T_1 extends true ? null : `0x${string}` : never : never;
            blockNumber: (TBlockTag extends "pending" ? true : false) extends infer T_2 ? T_2 extends (TBlockTag extends "pending" ? true : false) ? T_2 extends true ? null : bigint : never : never;
            transactionIndex: (TBlockTag extends "pending" ? true : false) extends infer T_3 ? T_3 extends (TBlockTag extends "pending" ? true : false) ? T_3 extends true ? null : number : never : never;
        } | {
            value: bigint;
            from: `0x${string}`;
            to: `0x${string}` | null;
            nonce: number;
            gasPrice: bigint;
            hash: `0x${string}`;
            chainId: number;
            type: "eip2930";
            yParity: number;
            gas: bigint;
            input: `0x${string}`;
            r: `0x${string}`;
            s: `0x${string}`;
            typeHex: `0x${string}` | null;
            v: bigint;
            maxFeePerBlobGas?: undefined;
            maxFeePerGas?: undefined;
            maxPriorityFeePerGas?: undefined;
            accessList: viem.AccessList;
            blobVersionedHashes?: undefined;
            blockHash: (TBlockTag extends "pending" ? true : false) extends infer T_4 ? T_4 extends (TBlockTag extends "pending" ? true : false) ? T_4 extends true ? null : `0x${string}` : never : never;
            blockNumber: (TBlockTag extends "pending" ? true : false) extends infer T_5 ? T_5 extends (TBlockTag extends "pending" ? true : false) ? T_5 extends true ? null : bigint : never : never;
            transactionIndex: (TBlockTag extends "pending" ? true : false) extends infer T_6 ? T_6 extends (TBlockTag extends "pending" ? true : false) ? T_6 extends true ? null : number : never : never;
        } | {
            value: bigint;
            from: `0x${string}`;
            to: `0x${string}` | null;
            nonce: number;
            gasPrice?: undefined;
            hash: `0x${string}`;
            chainId: number;
            type: "eip1559";
            yParity: number;
            gas: bigint;
            input: `0x${string}`;
            r: `0x${string}`;
            s: `0x${string}`;
            typeHex: `0x${string}` | null;
            v: bigint;
            maxFeePerBlobGas?: undefined;
            maxFeePerGas: bigint;
            maxPriorityFeePerGas: bigint;
            accessList: viem.AccessList;
            blobVersionedHashes?: undefined;
            blockHash: (TBlockTag extends "pending" ? true : false) extends infer T_7 ? T_7 extends (TBlockTag extends "pending" ? true : false) ? T_7 extends true ? null : `0x${string}` : never : never;
            blockNumber: (TBlockTag extends "pending" ? true : false) extends infer T_8 ? T_8 extends (TBlockTag extends "pending" ? true : false) ? T_8 extends true ? null : bigint : never : never;
            transactionIndex: (TBlockTag extends "pending" ? true : false) extends infer T_9 ? T_9 extends (TBlockTag extends "pending" ? true : false) ? T_9 extends true ? null : number : never : never;
        } | {
            value: bigint;
            from: `0x${string}`;
            to: `0x${string}` | null;
            nonce: number;
            gasPrice?: undefined;
            hash: `0x${string}`;
            chainId: number;
            type: "eip4844";
            yParity: number;
            gas: bigint;
            input: `0x${string}`;
            r: `0x${string}`;
            s: `0x${string}`;
            typeHex: `0x${string}` | null;
            v: bigint;
            maxFeePerBlobGas: bigint;
            maxFeePerGas: bigint;
            maxPriorityFeePerGas: bigint;
            accessList: viem.AccessList;
            blobVersionedHashes: readonly `0x${string}`[];
            blockHash: (TBlockTag extends "pending" ? true : false) extends infer T_10 ? T_10 extends (TBlockTag extends "pending" ? true : false) ? T_10 extends true ? null : `0x${string}` : never : never;
            blockNumber: (TBlockTag extends "pending" ? true : false) extends infer T_11 ? T_11 extends (TBlockTag extends "pending" ? true : false) ? T_11 extends true ? null : bigint : never : never;
            transactionIndex: (TBlockTag extends "pending" ? true : false) extends infer T_12 ? T_12 extends (TBlockTag extends "pending" ? true : false) ? T_12 extends true ? null : number : never : never;
        })[] : `0x${string}`[];
    }>;
    getBlockNumber: (args?: viem.GetBlockNumberParameters | undefined) => Promise<bigint>;
    getBlockTransactionCount: (args?: viem.GetBlockTransactionCountParameters | undefined) => Promise<number>;
    getBytecode: (args: viem.GetBytecodeParameters) => Promise<viem.GetBytecodeReturnType>;
    getChainId: () => Promise<number>;
    getContractEvents: <const abi_1 extends viem.Abi | readonly unknown[], eventName extends viem.ContractEventName<abi_1> | undefined = undefined, strict extends boolean | undefined = undefined, fromBlock extends bigint | viem.BlockTag | undefined = undefined, toBlock extends bigint | viem.BlockTag | undefined = undefined>(args: viem.GetContractEventsParameters<abi_1, eventName, strict, fromBlock, toBlock>) => Promise<viem.GetContractEventsReturnType<abi_1, eventName, strict, fromBlock, toBlock>>;
    getEnsAddress: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: viem.BlockTag | undefined;
        coinType?: number | undefined;
        gatewayUrls?: string[] | undefined;
        name: string;
        strict?: boolean | undefined;
        universalResolverAddress?: `0x${string}` | undefined;
    }) => Promise<viem.GetEnsAddressReturnType>;
    getEnsAvatar: (args: {
        name: string;
        blockNumber?: bigint | undefined;
        blockTag?: viem.BlockTag | undefined;
        gatewayUrls?: string[] | undefined;
        strict?: boolean | undefined;
        universalResolverAddress?: `0x${string}` | undefined;
        assetGatewayUrls?: viem.AssetGatewayUrls | undefined;
    }) => Promise<viem.GetEnsAvatarReturnType>;
    getEnsName: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: viem.BlockTag | undefined;
        address: `0x${string}`;
        gatewayUrls?: string[] | undefined;
        strict?: boolean | undefined;
        universalResolverAddress?: `0x${string}` | undefined;
    }) => Promise<viem.GetEnsNameReturnType>;
    getEnsResolver: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: viem.BlockTag | undefined;
        name: string;
        universalResolverAddress?: `0x${string}` | undefined;
    }) => Promise<`0x${string}`>;
    getEnsText: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: viem.BlockTag | undefined;
        name: string;
        gatewayUrls?: string[] | undefined;
        key: string;
        strict?: boolean | undefined;
        universalResolverAddress?: `0x${string}` | undefined;
    }) => Promise<viem.GetEnsTextReturnType>;
    getFeeHistory: (args: viem.GetFeeHistoryParameters) => Promise<viem.GetFeeHistoryReturnType>;
    estimateFeesPerGas: <TChainOverride extends viem.Chain | undefined = undefined, TType extends viem.FeeValuesType = "eip1559">(args?: viem.EstimateFeesPerGasParameters<viem.Chain | undefined, TChainOverride, TType> | undefined) => Promise<viem.EstimateFeesPerGasReturnType>;
    getFilterChanges: <TFilterType extends viem.FilterType, const TAbi_1 extends viem.Abi | readonly unknown[] | undefined, TEventName_1 extends string | undefined, TStrict_2 extends boolean | undefined = undefined, TFromBlock_2 extends bigint | viem.BlockTag | undefined = undefined, TToBlock_2 extends bigint | viem.BlockTag | undefined = undefined>(args: viem.GetFilterChangesParameters<TFilterType, TAbi_1, TEventName_1, TStrict_2, TFromBlock_2, TToBlock_2>) => Promise<viem.GetFilterChangesReturnType<TFilterType, TAbi_1, TEventName_1, TStrict_2, TFromBlock_2, TToBlock_2>>;
    getFilterLogs: <const TAbi_2 extends viem.Abi | readonly unknown[] | undefined, TEventName_2 extends string | undefined, TStrict_3 extends boolean | undefined = undefined, TFromBlock_3 extends bigint | viem.BlockTag | undefined = undefined, TToBlock_3 extends bigint | viem.BlockTag | undefined = undefined>(args: viem.GetFilterLogsParameters<TAbi_2, TEventName_2, TStrict_3, TFromBlock_3, TToBlock_3>) => Promise<viem.GetFilterLogsReturnType<TAbi_2, TEventName_2, TStrict_3, TFromBlock_3, TToBlock_3>>;
    getGasPrice: () => Promise<bigint>;
    getLogs: <const TAbiEvent_1 extends viem.AbiEvent | undefined = undefined, const TAbiEvents_1 extends readonly unknown[] | readonly viem.AbiEvent[] | undefined = TAbiEvent_1 extends viem.AbiEvent ? [TAbiEvent_1] : undefined, TStrict_4 extends boolean | undefined = undefined, TFromBlock_4 extends bigint | viem.BlockTag | undefined = undefined, TToBlock_4 extends bigint | viem.BlockTag | undefined = undefined>(args?: viem.GetLogsParameters<TAbiEvent_1, TAbiEvents_1, TStrict_4, TFromBlock_4, TToBlock_4> | undefined) => Promise<viem.GetLogsReturnType<TAbiEvent_1, TAbiEvents_1, TStrict_4, TFromBlock_4, TToBlock_4>>;
    getProof: (args: viem.GetProofParameters) => Promise<viem.GetProofReturnType>;
    estimateMaxPriorityFeePerGas: <TChainOverride_1 extends viem.Chain | undefined = undefined>(args?: {
        chain: TChainOverride_1 | null;
    } | undefined) => Promise<bigint>;
    getStorageAt: (args: viem.GetStorageAtParameters) => Promise<viem.GetStorageAtReturnType>;
    getTransaction: <TBlockTag_1 extends viem.BlockTag = "latest">(args: viem.GetTransactionParameters<TBlockTag_1>) => Promise<{
        value: bigint;
        from: `0x${string}`;
        to: `0x${string}` | null;
        nonce: number;
        gasPrice: bigint;
        hash: `0x${string}`;
        chainId?: number | undefined;
        type: "legacy";
        yParity?: undefined;
        gas: bigint;
        input: `0x${string}`;
        r: `0x${string}`;
        s: `0x${string}`;
        typeHex: `0x${string}` | null;
        v: bigint;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: undefined;
        maxPriorityFeePerGas?: undefined;
        accessList?: undefined;
        blobVersionedHashes?: undefined;
        blockHash: (TBlockTag_1 extends "pending" ? true : false) extends infer T_13 ? T_13 extends (TBlockTag_1 extends "pending" ? true : false) ? T_13 extends true ? null : `0x${string}` : never : never;
        blockNumber: (TBlockTag_1 extends "pending" ? true : false) extends infer T_14 ? T_14 extends (TBlockTag_1 extends "pending" ? true : false) ? T_14 extends true ? null : bigint : never : never;
        transactionIndex: (TBlockTag_1 extends "pending" ? true : false) extends infer T_15 ? T_15 extends (TBlockTag_1 extends "pending" ? true : false) ? T_15 extends true ? null : number : never : never;
    } | {
        value: bigint;
        from: `0x${string}`;
        to: `0x${string}` | null;
        nonce: number;
        gasPrice: bigint;
        hash: `0x${string}`;
        chainId: number;
        type: "eip2930";
        yParity: number;
        gas: bigint;
        input: `0x${string}`;
        r: `0x${string}`;
        s: `0x${string}`;
        typeHex: `0x${string}` | null;
        v: bigint;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: undefined;
        maxPriorityFeePerGas?: undefined;
        accessList: viem.AccessList;
        blobVersionedHashes?: undefined;
        blockHash: (TBlockTag_1 extends "pending" ? true : false) extends infer T_16 ? T_16 extends (TBlockTag_1 extends "pending" ? true : false) ? T_16 extends true ? null : `0x${string}` : never : never;
        blockNumber: (TBlockTag_1 extends "pending" ? true : false) extends infer T_17 ? T_17 extends (TBlockTag_1 extends "pending" ? true : false) ? T_17 extends true ? null : bigint : never : never;
        transactionIndex: (TBlockTag_1 extends "pending" ? true : false) extends infer T_18 ? T_18 extends (TBlockTag_1 extends "pending" ? true : false) ? T_18 extends true ? null : number : never : never;
    } | {
        value: bigint;
        from: `0x${string}`;
        to: `0x${string}` | null;
        nonce: number;
        gasPrice?: undefined;
        hash: `0x${string}`;
        chainId: number;
        type: "eip1559";
        yParity: number;
        gas: bigint;
        input: `0x${string}`;
        r: `0x${string}`;
        s: `0x${string}`;
        typeHex: `0x${string}` | null;
        v: bigint;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
        accessList: viem.AccessList;
        blobVersionedHashes?: undefined;
        blockHash: (TBlockTag_1 extends "pending" ? true : false) extends infer T_19 ? T_19 extends (TBlockTag_1 extends "pending" ? true : false) ? T_19 extends true ? null : `0x${string}` : never : never;
        blockNumber: (TBlockTag_1 extends "pending" ? true : false) extends infer T_20 ? T_20 extends (TBlockTag_1 extends "pending" ? true : false) ? T_20 extends true ? null : bigint : never : never;
        transactionIndex: (TBlockTag_1 extends "pending" ? true : false) extends infer T_21 ? T_21 extends (TBlockTag_1 extends "pending" ? true : false) ? T_21 extends true ? null : number : never : never;
    } | {
        value: bigint;
        from: `0x${string}`;
        to: `0x${string}` | null;
        nonce: number;
        gasPrice?: undefined;
        hash: `0x${string}`;
        chainId: number;
        type: "eip4844";
        yParity: number;
        gas: bigint;
        input: `0x${string}`;
        r: `0x${string}`;
        s: `0x${string}`;
        typeHex: `0x${string}` | null;
        v: bigint;
        maxFeePerBlobGas: bigint;
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
        accessList: viem.AccessList;
        blobVersionedHashes: readonly `0x${string}`[];
        blockHash: (TBlockTag_1 extends "pending" ? true : false) extends infer T_22 ? T_22 extends (TBlockTag_1 extends "pending" ? true : false) ? T_22 extends true ? null : `0x${string}` : never : never;
        blockNumber: (TBlockTag_1 extends "pending" ? true : false) extends infer T_23 ? T_23 extends (TBlockTag_1 extends "pending" ? true : false) ? T_23 extends true ? null : bigint : never : never;
        transactionIndex: (TBlockTag_1 extends "pending" ? true : false) extends infer T_24 ? T_24 extends (TBlockTag_1 extends "pending" ? true : false) ? T_24 extends true ? null : number : never : never;
    }>;
    getTransactionConfirmations: (args: viem.GetTransactionConfirmationsParameters<viem.Chain | undefined>) => Promise<bigint>;
    getTransactionCount: (args: viem.GetTransactionCountParameters) => Promise<number>;
    getTransactionReceipt: (args: viem.GetTransactionReceiptParameters) => Promise<viem.TransactionReceipt>;
    multicall: <const contracts extends readonly unknown[], allowFailure extends boolean = true>(args: viem.MulticallParameters<contracts, allowFailure>) => Promise<viem.MulticallReturnType<contracts, allowFailure>>;
    prepareTransactionRequest: <const TRequest extends viem.PrepareTransactionRequestRequest<viem.Chain | undefined, TChainOverride_2>, TChainOverride_2 extends viem.Chain | undefined = undefined, TAccountOverride extends `0x${string}` | viem.Account | undefined = undefined>(args: viem.PrepareTransactionRequestParameters<viem.Chain | undefined, viem.Account | undefined, TChainOverride_2, TAccountOverride, TRequest>) => Promise<viem.UnionRequiredBy<Extract<viem.UnionOmit<viem.ExtractChainFormatterParameters<viem.DeriveChain<viem.Chain, TChainOverride_2>, "transactionRequest", viem.TransactionRequest>, "from"> & (viem.DeriveChain<viem.Chain, TChainOverride_2> extends infer T_37 ? T_37 extends viem.DeriveChain<viem.Chain, TChainOverride_2> ? T_37 extends viem.Chain ? {
        chain: T_37;
    } : {
        chain?: undefined;
    } : never : never) & (viem.DeriveAccount<viem.Account | undefined, TAccountOverride> extends infer T_38 ? T_38 extends viem.DeriveAccount<viem.Account | undefined, TAccountOverride> ? T_38 extends viem.Account ? {
        account: T_38;
        from: `0x${string}`;
    } : {
        account?: undefined;
        from?: undefined;
    } : never : never), viem.IsNever<((TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_39 ? T_39 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_39 extends "legacy" ? viem.TransactionRequestLegacy : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_40 ? T_40 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_40 extends "eip1559" ? viem.TransactionRequestEIP1559 : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_41 ? T_41 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_41 extends "eip2930" ? viem.TransactionRequestEIP2930 : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_42 ? T_42 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_42 extends "eip4844" ? viem.TransactionRequestEIP4844 : never : never : never)> extends true ? unknown : viem.ExactPartial<((TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_43 ? T_43 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_43 extends "legacy" ? viem.TransactionRequestLegacy : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_44 ? T_44 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_44 extends "eip1559" ? viem.TransactionRequestEIP1559 : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_45 ? T_45 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_45 extends "eip2930" ? viem.TransactionRequestEIP2930 : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_46 ? T_46 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_46 extends "eip4844" ? viem.TransactionRequestEIP4844 : never : never : never)>> & {
        chainId?: number | undefined;
    }, (TRequest["parameters"] extends readonly viem.PrepareTransactionRequestParameterType[] ? TRequest["parameters"][number] : "nonce" | "chainId" | "type" | "gas" | "blobVersionedHashes" | "fees") extends infer T_47 ? T_47 extends (TRequest["parameters"] extends readonly viem.PrepareTransactionRequestParameterType[] ? TRequest["parameters"][number] : "nonce" | "chainId" | "type" | "gas" | "blobVersionedHashes" | "fees") ? T_47 extends "fees" ? "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" : T_47 : never : never> & (unknown extends TRequest["kzg"] ? {} : Pick<TRequest, "kzg">) extends infer T_25 ? { [K_1 in keyof T_25]: (viem.UnionRequiredBy<Extract<viem.UnionOmit<viem.ExtractChainFormatterParameters<viem.DeriveChain<viem.Chain, TChainOverride_2>, "transactionRequest", viem.TransactionRequest>, "from"> & (viem.DeriveChain<viem.Chain, TChainOverride_2> extends infer T_26 ? T_26 extends viem.DeriveChain<viem.Chain, TChainOverride_2> ? T_26 extends viem.Chain ? {
        chain: T_26;
    } : {
        chain?: undefined;
    } : never : never) & (viem.DeriveAccount<viem.Account | undefined, TAccountOverride> extends infer T_27 ? T_27 extends viem.DeriveAccount<viem.Account | undefined, TAccountOverride> ? T_27 extends viem.Account ? {
        account: T_27;
        from: `0x${string}`;
    } : {
        account?: undefined;
        from?: undefined;
    } : never : never), viem.IsNever<((TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_28 ? T_28 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_28 extends "legacy" ? viem.TransactionRequestLegacy : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_29 ? T_29 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_29 extends "eip1559" ? viem.TransactionRequestEIP1559 : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_30 ? T_30 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_30 extends "eip2930" ? viem.TransactionRequestEIP2930 : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_31 ? T_31 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_31 extends "eip4844" ? viem.TransactionRequestEIP4844 : never : never : never)> extends true ? unknown : viem.ExactPartial<((TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_32 ? T_32 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_32 extends "legacy" ? viem.TransactionRequestLegacy : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_33 ? T_33 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_33 extends "eip1559" ? viem.TransactionRequestEIP1559 : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_34 ? T_34 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_34 extends "eip2930" ? viem.TransactionRequestEIP2930 : never : never : never) | ((TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_35 ? T_35 extends (TRequest["type"] extends string | undefined ? TRequest["type"] : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : viem.GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & viem.FeeValuesLegacy) | viem.Opaque<viem.TransactionSerializableLegacy, TRequest> | viem.Opaque<viem.TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (viem.OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, viem.FeeValuesEIP1559> & {
        accessList?: viem.AccessList | undefined;
    })) | viem.Opaque<viem.TransactionSerializableEIP1559, TRequest> | viem.Opaque<viem.TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: viem.AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & viem.ExactPartial<viem.FeeValuesLegacy> & {
        accessList: viem.AccessList | undefined;
    }) | viem.Opaque<viem.TransactionSerializableEIP2930, TRequest> | viem.Opaque<viem.TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    } & (viem.ExactPartial<viem.FeeValuesEIP4844> & viem.OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly viem.BlobSidecar<`0x${string}`>[] | undefined;
    }, viem.TransactionSerializableEIP4844>)) | viem.Opaque<viem.TransactionSerializableEIP4844, TRequest> | viem.Opaque<viem.TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_35 extends "eip4844" ? viem.TransactionRequestEIP4844 : never : never : never)>> & {
        chainId?: number | undefined;
    }, (TRequest["parameters"] extends readonly viem.PrepareTransactionRequestParameterType[] ? TRequest["parameters"][number] : "nonce" | "chainId" | "type" | "gas" | "blobVersionedHashes" | "fees") extends infer T_36 ? T_36 extends (TRequest["parameters"] extends readonly viem.PrepareTransactionRequestParameterType[] ? TRequest["parameters"][number] : "nonce" | "chainId" | "type" | "gas" | "blobVersionedHashes" | "fees") ? T_36 extends "fees" ? "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" : T_36 : never : never> & (unknown extends TRequest["kzg"] ? {} : Pick<TRequest, "kzg">))[K_1]; } : never>;
    readContract: <const abi_2 extends viem.Abi | readonly unknown[], functionName_1 extends viem.ContractFunctionName<abi_2, "view" | "pure">, args_1 extends viem.ContractFunctionArgs<abi_2, "view" | "pure", functionName_1>>(args: viem.ReadContractParameters<abi_2, functionName_1, args_1>) => Promise<viem.ReadContractReturnType<abi_2, functionName_1, args_1>>;
    sendRawTransaction: (args: viem.SendRawTransactionParameters) => Promise<`0x${string}`>;
    simulateContract: <const abi_3 extends viem.Abi | readonly unknown[], functionName_2 extends viem.ContractFunctionName<abi_3, "nonpayable" | "payable">, args_2 extends viem.ContractFunctionArgs<abi_3, "nonpayable" | "payable", functionName_2>, chainOverride extends viem.Chain | undefined, accountOverride extends `0x${string}` | viem.Account | undefined = undefined>(args: viem.SimulateContractParameters<abi_3, functionName_2, args_2, viem.Chain | undefined, chainOverride, accountOverride>) => Promise<viem.SimulateContractReturnType<abi_3, functionName_2, args_2, viem.Chain | undefined, viem.Account | undefined, chainOverride, accountOverride>>;
    verifyMessage: (args: {
        address: `0x${string}`;
        blockNumber?: bigint | undefined;
        blockTag?: viem.BlockTag | undefined;
        signature: `0x${string}` | Uint8Array | viem.Signature;
        message: viem.SignableMessage;
    }) => Promise<boolean>;
    verifySiweMessage: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: viem.BlockTag | undefined;
        address?: `0x${string}` | undefined;
        nonce?: string | undefined;
        domain?: string | undefined;
        scheme?: string | undefined;
        time?: Date | undefined;
        message: string;
        signature: `0x${string}`;
    }) => Promise<boolean>;
    verifyTypedData: (args: viem.VerifyTypedDataActionParameters) => Promise<boolean>;
    uninstallFilter: (args: viem.UninstallFilterParameters) => Promise<boolean>;
    waitForTransactionReceipt: (args: viem.WaitForTransactionReceiptParameters<viem.Chain | undefined>) => Promise<viem.TransactionReceipt>;
    watchBlockNumber: (args: viem.WatchBlockNumberParameters) => viem.WatchBlockNumberReturnType;
    watchBlocks: <TIncludeTransactions_1 extends boolean = false, TBlockTag_2 extends viem.BlockTag = "latest">(args: viem.WatchBlocksParameters<viem.Transport, viem.Chain | undefined, TIncludeTransactions_1, TBlockTag_2>) => viem.WatchBlocksReturnType;
    watchContractEvent: <const TAbi_3 extends viem.Abi | readonly unknown[], TEventName_3 extends viem.ContractEventName<TAbi_3>, TStrict_5 extends boolean | undefined = undefined>(args: viem.WatchContractEventParameters<TAbi_3, TEventName_3, TStrict_5, viem.Transport>) => viem.WatchContractEventReturnType;
    watchEvent: <const TAbiEvent_2 extends viem.AbiEvent | undefined = undefined, const TAbiEvents_2 extends readonly unknown[] | readonly viem.AbiEvent[] | undefined = TAbiEvent_2 extends viem.AbiEvent ? [TAbiEvent_2] : undefined, TStrict_6 extends boolean | undefined = undefined>(args: viem.WatchEventParameters<TAbiEvent_2, TAbiEvents_2, TStrict_6, viem.Transport>) => viem.WatchEventReturnType;
    watchPendingTransactions: (args: viem.WatchPendingTransactionsParameters<viem.Transport>) => viem.WatchPendingTransactionsReturnType;
    _tevm: {
        readonly logger: _tevm_logger.Logger;
        readonly getReceiptsManager: () => Promise<_tevm_receipt_manager.ReceiptsManager>;
        readonly miningConfig: _tevm_base_client.MiningConfig;
        readonly forkTransport?: {
            request: viem.EIP1193RequestFn;
        };
        readonly mode: "fork" | "normal";
        readonly ready: () => Promise<true>;
        readonly getVm: () => Promise<_tevm_vm.Vm>;
        readonly getTxPool: () => Promise<_tevm_txpool.TxPool>;
        readonly impersonatedAccount: `0x${string}` | undefined;
        readonly setImpersonatedAccount: (address: `0x${string}` | undefined) => void;
        readonly extend: <TExtension extends Record<string, any>>(decorator: (client: _tevm_base_client.BaseClient<"fork" | "normal", {}>) => TExtension) => _tevm_base_client.BaseClient<"fork" | "normal", {} & TExtension>;
        readonly setFilter: (filter: _tevm_base_client.Filter) => void;
        readonly getFilters: () => Map<`0x${string}`, _tevm_base_client.Filter>;
        readonly removeFilter: (id: `0x${string}`) => void;
    } & _tevm_base_client.EIP1193Events & {
        emit(eventName: keyof _tevm_base_client.EIP1193EventMap, ...args: any[]): boolean;
    } & _tevm_decorators.Eip1193RequestProvider & _tevm_decorators.TevmActionsApi & {
        send: _tevm_procedures_types.TevmJsonRpcRequestHandler;
        sendBulk: _tevm_procedures_types.TevmJsonRpcBulkRequestHandler;
        request: _tevm_decorators.EIP1193RequestFn;
    };
    tevmForkUrl?: string;
    tevmCall: _tevm_actions_types.CallHandler;
    tevmContract: _tevm_actions_types.ContractHandler;
    tevmScript: _tevm_actions_types.ScriptHandler;
    tevmDeploy: _tevm_actions_types.DeployHandler;
    tevmMine: _tevm_actions_types.MineHandler;
    tevmLoadState: _tevm_actions_types.LoadStateHandler;
    tevmDumpState: _tevm_actions_types.DumpStateHandler;
    tevmSetAccount: _tevm_actions_types.SetAccountHandler;
    tevmGetAccount: _tevm_actions_types.GetAccountHandler;
    extend: <const client extends {
        [x: string]: unknown;
        account?: undefined;
        batch?: undefined;
        cacheTime?: undefined;
        ccipRead?: undefined;
        chain?: undefined;
        key?: undefined;
        name?: undefined;
        pollingInterval?: undefined;
        request?: undefined;
        transport?: undefined;
        type?: undefined;
        uid?: undefined;
    } & viem.ExactPartial<Pick<viem.PublicActions<viem.Transport, undefined, undefined>, "call" | "createContractEventFilter" | "createEventFilter" | "estimateContractGas" | "estimateGas" | "getBlock" | "getBlockNumber" | "getChainId" | "getContractEvents" | "getEnsText" | "getFilterChanges" | "getGasPrice" | "getLogs" | "getTransaction" | "getTransactionCount" | "getTransactionReceipt" | "prepareTransactionRequest" | "readContract" | "sendRawTransaction" | "simulateContract" | "uninstallFilter" | "watchBlockNumber" | "watchContractEvent"> & Pick<viem.WalletActions<undefined, undefined>, "sendTransaction" | "writeContract">>>(fn: (client: viem.Client<viem.Transport, undefined, undefined, [{
        Method: "web3_clientVersion";
        Parameters?: undefined;
        ReturnType: string;
    }, {
        Method: "web3_sha3";
        Parameters: [data: `0x${string}`];
        ReturnType: string;
    }, {
        Method: "net_listening";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "net_peerCount";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "net_version";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_blobBaseFee";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_blockNumber";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_call";
        Parameters: [transaction: viem.ExactPartial<viem.RpcTransactionRequest>] | [transaction: viem.ExactPartial<viem.RpcTransactionRequest>, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier] | [transaction: viem.ExactPartial<viem.RpcTransactionRequest>, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier, stateOverrideSet: viem.RpcStateOverride];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_chainId";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_coinbase";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_estimateGas";
        Parameters: [transaction: viem.RpcTransactionRequest] | [transaction: viem.RpcTransactionRequest, block: `0x${string}` | viem.BlockTag] | [transaction: viem.RpcTransactionRequest, block: `0x${string}` | viem.BlockTag, viem.RpcStateOverride];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_feeHistory";
        Parameters: [blockCount: `0x${string}`, newestBlock: `0x${string}` | viem.BlockTag, rewardPercentiles: number[] | undefined];
        ReturnType: viem.RpcFeeHistory;
    }, {
        Method: "eth_gasPrice";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBalance";
        Parameters: [address: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBlockByHash";
        Parameters: [hash: `0x${string}`, includeTransactionObjects: boolean];
        ReturnType: viem.RpcBlock | null;
    }, {
        Method: "eth_getBlockByNumber";
        Parameters: [block: `0x${string}` | viem.BlockTag, includeTransactionObjects: boolean];
        ReturnType: viem.RpcBlock | null;
    }, {
        Method: "eth_getBlockTransactionCountByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBlockTransactionCountByNumber";
        Parameters: [block: `0x${string}` | viem.BlockTag];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getCode";
        Parameters: [address: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getFilterChanges";
        Parameters: [filterId: `0x${string}`];
        ReturnType: `0x${string}`[] | viem.RpcLog[];
    }, {
        Method: "eth_getFilterLogs";
        Parameters: [filterId: `0x${string}`];
        ReturnType: viem.RpcLog[];
    }, {
        Method: "eth_getLogs";
        Parameters: [{
            address?: `0x${string}` | `0x${string}`[] | undefined;
            topics?: viem.LogTopic[] | undefined;
        } & ({
            fromBlock?: `0x${string}` | viem.BlockTag | undefined;
            toBlock?: `0x${string}` | viem.BlockTag | undefined;
            blockHash?: undefined;
        } | {
            fromBlock?: undefined;
            toBlock?: undefined;
            blockHash?: `0x${string}` | undefined;
        })];
        ReturnType: viem.RpcLog[];
    }, {
        Method: "eth_getProof";
        Parameters: [address: `0x${string}`, storageKeys: `0x${string}`[], block: `0x${string}` | viem.BlockTag];
        ReturnType: viem.RpcProof;
    }, {
        Method: "eth_getStorageAt";
        Parameters: [address: `0x${string}`, index: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getTransactionByBlockHashAndIndex";
        Parameters: [hash: `0x${string}`, index: `0x${string}`];
        ReturnType: viem.RpcTransaction | null;
    }, {
        Method: "eth_getTransactionByBlockNumberAndIndex";
        Parameters: [block: `0x${string}` | viem.BlockTag, index: `0x${string}`];
        ReturnType: viem.RpcTransaction | null;
    }, {
        Method: "eth_getTransactionByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: viem.RpcTransaction | null;
    }, {
        Method: "eth_getTransactionCount";
        Parameters: [address: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getTransactionReceipt";
        Parameters: [hash: `0x${string}`];
        ReturnType: viem.RpcTransactionReceipt | null;
    }, {
        Method: "eth_getUncleByBlockHashAndIndex";
        Parameters: [hash: `0x${string}`, index: `0x${string}`];
        ReturnType: viem.RpcUncle | null;
    }, {
        Method: "eth_getUncleByBlockNumberAndIndex";
        Parameters: [block: `0x${string}` | viem.BlockTag, index: `0x${string}`];
        ReturnType: viem.RpcUncle | null;
    }, {
        Method: "eth_getUncleCountByBlockHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getUncleCountByBlockNumber";
        Parameters: [block: `0x${string}` | viem.BlockTag];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_maxPriorityFeePerGas";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newBlockFilter";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newFilter";
        Parameters: [filter: {
            fromBlock?: `0x${string}` | viem.BlockTag | undefined;
            toBlock?: `0x${string}` | viem.BlockTag | undefined;
            address?: `0x${string}` | `0x${string}`[] | undefined;
            topics?: viem.LogTopic[] | undefined;
        }];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newPendingTransactionFilter";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_protocolVersion";
        Parameters?: undefined;
        ReturnType: string;
    }, {
        Method: "eth_sendRawTransaction";
        Parameters: [signedTransaction: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_uninstallFilter";
        Parameters: [filterId: `0x${string}`];
        ReturnType: boolean;
    }, {
        Method: "anvil_addCompilationResult" | "ganache_addCompilationResult" | "hardhat_addCompilationResult";
        Parameters: any[];
        ReturnType: any;
    }, {
        Method: "anvil_dropTransaction" | "ganache_dropTransaction" | "hardhat_dropTransaction";
        Parameters: [hash: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_dumpState" | "ganache_dumpState" | "hardhat_dumpState";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "anvil_enableTraces" | "ganache_enableTraces" | "hardhat_enableTraces";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "anvil_impersonateAccount" | "ganache_impersonateAccount" | "hardhat_impersonateAccount";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_getAutomine" | "ganache_getAutomine" | "hardhat_getAutomine";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "anvil_loadState" | "ganache_loadState" | "hardhat_loadState";
        Parameters?: [`0x${string}`] | undefined;
        ReturnType: void;
    }, {
        Method: "anvil_mine" | "ganache_mine" | "hardhat_mine";
        Parameters: [count: `0x${string}`, interval: `0x${string}` | undefined];
        ReturnType: void;
    }, {
        Method: "anvil_reset" | "ganache_reset" | "hardhat_reset";
        Parameters: any[];
        ReturnType: void;
    }, {
        Method: "anvil_setBalance" | "ganache_setBalance" | "hardhat_setBalance";
        Parameters: [address: `0x${string}`, balance: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setCode" | "ganache_setCode" | "hardhat_setCode";
        Parameters: [address: `0x${string}`, data: string];
        ReturnType: void;
    }, {
        Method: "anvil_setCoinbase" | "ganache_setCoinbase" | "hardhat_setCoinbase";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setLoggingEnabled" | "ganache_setLoggingEnabled" | "hardhat_setLoggingEnabled";
        Parameters: [enabled: boolean];
        ReturnType: void;
    }, {
        Method: "anvil_setMinGasPrice" | "ganache_setMinGasPrice" | "hardhat_setMinGasPrice";
        Parameters: [gasPrice: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setNextBlockBaseFeePerGas" | "ganache_setNextBlockBaseFeePerGas" | "hardhat_setNextBlockBaseFeePerGas";
        Parameters: [baseFeePerGas: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setNonce" | "ganache_setNonce" | "hardhat_setNonce";
        Parameters: [address: `0x${string}`, nonce: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setRpcUrl" | "ganache_setRpcUrl" | "hardhat_setRpcUrl";
        Parameters: [url: string];
        ReturnType: void;
    }, {
        Method: "anvil_setStorageAt" | "ganache_setStorageAt" | "hardhat_setStorageAt";
        Parameters: [address: `0x${string}`, index: `0x${string}`, value: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_stopImpersonatingAccount" | "ganache_stopImpersonatingAccount" | "hardhat_stopImpersonatingAccount";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_increaseTime" | "ganache_increaseTime" | "hardhat_increaseTime";
        Parameters: [seconds: number];
        ReturnType: `0x${string}`;
    }, {
        Method: "evm_setAccountBalance";
        Parameters: [address: `0x${string}`, value: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_setAutomine";
        Parameters: [boolean];
        ReturnType: void;
    }, {
        Method: "evm_setBlockGasLimit";
        Parameters: [gasLimit: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_increaseTime";
        Parameters: [seconds: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "anvil_setBlockTimestampInterval" | "ganache_setBlockTimestampInterval" | "hardhat_setBlockTimestampInterval";
        Parameters: [seconds: number];
        ReturnType: void;
    }, {
        Method: "anvil_removeBlockTimestampInterval" | "ganache_removeBlockTimestampInterval" | "hardhat_removeBlockTimestampInterval";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "evm_setIntervalMining";
        Parameters: [number];
        ReturnType: void;
    }, {
        Method: "evm_setNextBlockTimestamp";
        Parameters: [`0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_snapshot";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "evm_revert";
        Parameters?: [id: `0x${string}`] | undefined;
        ReturnType: void;
    }, {
        Method: "miner_start";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "miner_stop";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "txpool_content";
        Parameters?: undefined;
        ReturnType: {
            pending: Record<`0x${string}`, Record<string, viem.RpcTransaction>>;
            queued: Record<`0x${string}`, Record<string, viem.RpcTransaction>>;
        };
    }, {
        Method: "txpool_inspect";
        Parameters?: undefined;
        ReturnType: {
            pending: Record<`0x${string}`, Record<string, string>>;
            queued: Record<`0x${string}`, Record<string, string>>;
        };
    }, {
        Method: "txpool_status";
        Parameters?: undefined;
        ReturnType: {
            pending: `0x${string}`;
            queued: `0x${string}`;
        };
    }, {
        Method: "eth_mining";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "evm_mine";
        Parameters?: [{
            blocks: `0x${string}`;
        }] | undefined;
        ReturnType: void;
    }, {
        Method: "eth_sendUnsignedTransaction";
        Parameters: [transaction: viem.RpcTransactionRequest];
        ReturnType: `0x${string}`;
    }, {
        Method: "tevm_call";
        Parameters: [params: {
            data?: `0x${string}`;
            deployedBytecode?: `0x${string}`;
            value?: `0x${string}`;
            from?: `0x${string}`;
            to?: `0x${string}`;
            gasPrice?: `0x${string}`;
            gas?: `0x${string}`;
            blobVersionedHashes?: `0x${string}`[];
            blockTag?: `0x${string}` | _tevm_actions_types.BlockTag;
            gasRefund?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            throwOnFail?: boolean;
            createTrace?: boolean;
            createAccessList?: boolean;
            createTransaction?: boolean | "on-success" | "always" | "never";
            skipBalance?: boolean;
            origin?: `0x${string}`;
            caller?: `0x${string}`;
            depth?: number;
            salt?: `0x${string}`;
        }, stateOverrideSet?: {
            [x: `0x${string}`]: {
                balance?: `0x${string}`;
                nonce?: `0x${string}`;
                code?: `0x${string}`;
                state?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
                stateDiff?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
            };
        } | undefined, blockOverrideSet?: {
            number?: `0x${string}`;
            time?: `0x${string}`;
            gasLimit?: `0x${string}`;
            coinbase?: `0x${string}`;
            baseFee?: `0x${string}`;
            blobBaseFee?: `0x${string}`;
        } | undefined];
        ReturnType: {
            trace?: {
                readonly failed: boolean;
                readonly gas: `0x${string}`;
                readonly returnValue: `0x${string}`;
                readonly structLogs: {
                    readonly depth: number;
                    readonly gas: `0x${string}`;
                    readonly gasCost: `0x${string}`;
                    readonly op: string;
                    readonly pc: number;
                    readonly stack: `0x${string}`[];
                    readonly error?: {
                        error: string;
                        errorType: string;
                    };
                }[];
            };
            accessList?: {
                [x: `0x${string}`]: readonly `0x${string}`[];
            };
            txHash?: `0x${string}`;
            gas?: `0x${string}`;
            executionGasUsed: `0x${string}`;
            logs?: {
                readonly address: `0x${string}`;
                readonly topics: `0x${string}`[];
                readonly data: `0x${string}`;
            }[];
            gasRefund?: `0x${string}`;
            blobGasUsed?: `0x${string}`;
            createdAddress?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            createdAddresses?: readonly `0x${string}`[];
            rawData: `0x${string}`;
            errors?: never[];
        };
    }, {
        Method: "tevm_script";
        Parameters: [params: {
            value?: `0x${string}`;
            from?: `0x${string}`;
            to?: `0x${string}`;
            gasPrice?: `0x${string}`;
            gas?: `0x${string}`;
            blobVersionedHashes?: `0x${string}`[];
            blockTag?: `0x${string}` | _tevm_actions_types.BlockTag;
            gasRefund?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            throwOnFail?: boolean;
            createTrace?: boolean;
            createAccessList?: boolean;
            createTransaction?: boolean | "on-success" | "always" | "never";
            skipBalance?: boolean;
            origin?: `0x${string}`;
            caller?: `0x${string}`;
            depth?: number;
        } & {
            data: `0x${string}`;
            deployedBytecode: `0x${string}`;
        }, stateOverrideSet?: {
            [x: `0x${string}`]: {
                balance?: `0x${string}`;
                nonce?: `0x${string}`;
                code?: `0x${string}`;
                state?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
                stateDiff?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
            };
        } | undefined, blockOverrideSet?: {
            number?: `0x${string}`;
            time?: `0x${string}`;
            gasLimit?: `0x${string}`;
            coinbase?: `0x${string}`;
            baseFee?: `0x${string}`;
            blobBaseFee?: `0x${string}`;
        } | undefined];
        ReturnType: {
            trace?: {
                readonly failed: boolean;
                readonly gas: `0x${string}`;
                readonly returnValue: `0x${string}`;
                readonly structLogs: {
                    readonly depth: number;
                    readonly gas: `0x${string}`;
                    readonly gasCost: `0x${string}`;
                    readonly op: string;
                    readonly pc: number;
                    readonly stack: `0x${string}`[];
                    readonly error?: {
                        error: string;
                        errorType: string;
                    };
                }[];
            };
            accessList?: {
                [x: `0x${string}`]: readonly `0x${string}`[];
            };
            txHash?: `0x${string}`;
            gas?: `0x${string}`;
            executionGasUsed: `0x${string}`;
            logs?: {
                readonly address: `0x${string}`;
                readonly topics: `0x${string}`[];
                readonly data: `0x${string}`;
            }[];
            gasRefund?: `0x${string}`;
            blobGasUsed?: `0x${string}`;
            createdAddress?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            createdAddresses?: readonly `0x${string}`[];
            rawData: `0x${string}`;
            errors?: never[];
        };
    }, {
        Method: "tevm_dumpState";
        Parameters?: [] | undefined;
        ReturnType: _tevm_actions_types.DumpStateResult<never>;
    }, {
        Method: "tevm_loadState";
        Parameters: [_tevm_procedures_types.SerializedParams];
        ReturnType: {
            errors?: never[];
        };
    }, {
        Method: "tevm_getAccount";
        Parameters: [{
            throwOnFail?: boolean;
            address: `0x${string}`;
            returnStorage?: boolean;
        }];
        ReturnType: {
            errors?: never[];
            address: `0x${string}`;
            nonce: `0x${string}`;
            balance: `0x${string}`;
            deployedBytecode: `0x${string}`;
            storageRoot: `0x${string}`;
            codeHash: `0x${string}`;
            isContract: boolean;
            isEmpty: boolean;
            storage?: {
                [x: `0x${string}`]: `0x${string}`;
            };
        };
    }, {
        Method: "tevm_setAccount";
        Parameters: [{
            throwOnFail?: boolean;
            address: `0x${string}`;
            nonce?: `0x${string}`;
            balance?: `0x${string}`;
            deployedBytecode?: `0x${string}`;
            storageRoot?: `0x${string}`;
            state?: {
                [x: `0x${string}`]: `0x${string}`;
            };
            stateDiff?: {
                [x: `0x${string}`]: `0x${string}`;
            };
        }];
        ReturnType: {
            errors?: never[];
        };
    }], viem.PublicActions & _tevm_memory_client.TevmActions>) => client) => viem.Client<viem.Transport, undefined, undefined, [{
        Method: "web3_clientVersion";
        Parameters?: undefined;
        ReturnType: string;
    }, {
        Method: "web3_sha3";
        Parameters: [data: `0x${string}`];
        ReturnType: string;
    }, {
        Method: "net_listening";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "net_peerCount";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "net_version";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_blobBaseFee";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_blockNumber";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_call";
        Parameters: [transaction: viem.ExactPartial<viem.RpcTransactionRequest>] | [transaction: viem.ExactPartial<viem.RpcTransactionRequest>, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier] | [transaction: viem.ExactPartial<viem.RpcTransactionRequest>, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier, stateOverrideSet: viem.RpcStateOverride];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_chainId";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_coinbase";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_estimateGas";
        Parameters: [transaction: viem.RpcTransactionRequest] | [transaction: viem.RpcTransactionRequest, block: `0x${string}` | viem.BlockTag] | [transaction: viem.RpcTransactionRequest, block: `0x${string}` | viem.BlockTag, viem.RpcStateOverride];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_feeHistory";
        Parameters: [blockCount: `0x${string}`, newestBlock: `0x${string}` | viem.BlockTag, rewardPercentiles: number[] | undefined];
        ReturnType: viem.RpcFeeHistory;
    }, {
        Method: "eth_gasPrice";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBalance";
        Parameters: [address: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBlockByHash";
        Parameters: [hash: `0x${string}`, includeTransactionObjects: boolean];
        ReturnType: viem.RpcBlock | null;
    }, {
        Method: "eth_getBlockByNumber";
        Parameters: [block: `0x${string}` | viem.BlockTag, includeTransactionObjects: boolean];
        ReturnType: viem.RpcBlock | null;
    }, {
        Method: "eth_getBlockTransactionCountByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getBlockTransactionCountByNumber";
        Parameters: [block: `0x${string}` | viem.BlockTag];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getCode";
        Parameters: [address: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getFilterChanges";
        Parameters: [filterId: `0x${string}`];
        ReturnType: `0x${string}`[] | viem.RpcLog[];
    }, {
        Method: "eth_getFilterLogs";
        Parameters: [filterId: `0x${string}`];
        ReturnType: viem.RpcLog[];
    }, {
        Method: "eth_getLogs";
        Parameters: [{
            address?: `0x${string}` | `0x${string}`[] | undefined;
            topics?: viem.LogTopic[] | undefined;
        } & ({
            fromBlock?: `0x${string}` | viem.BlockTag | undefined;
            toBlock?: `0x${string}` | viem.BlockTag | undefined;
            blockHash?: undefined;
        } | {
            fromBlock?: undefined;
            toBlock?: undefined;
            blockHash?: `0x${string}` | undefined;
        })];
        ReturnType: viem.RpcLog[];
    }, {
        Method: "eth_getProof";
        Parameters: [address: `0x${string}`, storageKeys: `0x${string}`[], block: `0x${string}` | viem.BlockTag];
        ReturnType: viem.RpcProof;
    }, {
        Method: "eth_getStorageAt";
        Parameters: [address: `0x${string}`, index: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getTransactionByBlockHashAndIndex";
        Parameters: [hash: `0x${string}`, index: `0x${string}`];
        ReturnType: viem.RpcTransaction | null;
    }, {
        Method: "eth_getTransactionByBlockNumberAndIndex";
        Parameters: [block: `0x${string}` | viem.BlockTag, index: `0x${string}`];
        ReturnType: viem.RpcTransaction | null;
    }, {
        Method: "eth_getTransactionByHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: viem.RpcTransaction | null;
    }, {
        Method: "eth_getTransactionCount";
        Parameters: [address: `0x${string}`, block: `0x${string}` | viem.BlockTag | viem.RpcBlockIdentifier];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getTransactionReceipt";
        Parameters: [hash: `0x${string}`];
        ReturnType: viem.RpcTransactionReceipt | null;
    }, {
        Method: "eth_getUncleByBlockHashAndIndex";
        Parameters: [hash: `0x${string}`, index: `0x${string}`];
        ReturnType: viem.RpcUncle | null;
    }, {
        Method: "eth_getUncleByBlockNumberAndIndex";
        Parameters: [block: `0x${string}` | viem.BlockTag, index: `0x${string}`];
        ReturnType: viem.RpcUncle | null;
    }, {
        Method: "eth_getUncleCountByBlockHash";
        Parameters: [hash: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_getUncleCountByBlockNumber";
        Parameters: [block: `0x${string}` | viem.BlockTag];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_maxPriorityFeePerGas";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newBlockFilter";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newFilter";
        Parameters: [filter: {
            fromBlock?: `0x${string}` | viem.BlockTag | undefined;
            toBlock?: `0x${string}` | viem.BlockTag | undefined;
            address?: `0x${string}` | `0x${string}`[] | undefined;
            topics?: viem.LogTopic[] | undefined;
        }];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_newPendingTransactionFilter";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_protocolVersion";
        Parameters?: undefined;
        ReturnType: string;
    }, {
        Method: "eth_sendRawTransaction";
        Parameters: [signedTransaction: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "eth_uninstallFilter";
        Parameters: [filterId: `0x${string}`];
        ReturnType: boolean;
    }, {
        Method: "anvil_addCompilationResult" | "ganache_addCompilationResult" | "hardhat_addCompilationResult";
        Parameters: any[];
        ReturnType: any;
    }, {
        Method: "anvil_dropTransaction" | "ganache_dropTransaction" | "hardhat_dropTransaction";
        Parameters: [hash: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_dumpState" | "ganache_dumpState" | "hardhat_dumpState";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "anvil_enableTraces" | "ganache_enableTraces" | "hardhat_enableTraces";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "anvil_impersonateAccount" | "ganache_impersonateAccount" | "hardhat_impersonateAccount";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_getAutomine" | "ganache_getAutomine" | "hardhat_getAutomine";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "anvil_loadState" | "ganache_loadState" | "hardhat_loadState";
        Parameters?: [`0x${string}`] | undefined;
        ReturnType: void;
    }, {
        Method: "anvil_mine" | "ganache_mine" | "hardhat_mine";
        Parameters: [count: `0x${string}`, interval: `0x${string}` | undefined];
        ReturnType: void;
    }, {
        Method: "anvil_reset" | "ganache_reset" | "hardhat_reset";
        Parameters: any[];
        ReturnType: void;
    }, {
        Method: "anvil_setBalance" | "ganache_setBalance" | "hardhat_setBalance";
        Parameters: [address: `0x${string}`, balance: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setCode" | "ganache_setCode" | "hardhat_setCode";
        Parameters: [address: `0x${string}`, data: string];
        ReturnType: void;
    }, {
        Method: "anvil_setCoinbase" | "ganache_setCoinbase" | "hardhat_setCoinbase";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setLoggingEnabled" | "ganache_setLoggingEnabled" | "hardhat_setLoggingEnabled";
        Parameters: [enabled: boolean];
        ReturnType: void;
    }, {
        Method: "anvil_setMinGasPrice" | "ganache_setMinGasPrice" | "hardhat_setMinGasPrice";
        Parameters: [gasPrice: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setNextBlockBaseFeePerGas" | "ganache_setNextBlockBaseFeePerGas" | "hardhat_setNextBlockBaseFeePerGas";
        Parameters: [baseFeePerGas: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setNonce" | "ganache_setNonce" | "hardhat_setNonce";
        Parameters: [address: `0x${string}`, nonce: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_setRpcUrl" | "ganache_setRpcUrl" | "hardhat_setRpcUrl";
        Parameters: [url: string];
        ReturnType: void;
    }, {
        Method: "anvil_setStorageAt" | "ganache_setStorageAt" | "hardhat_setStorageAt";
        Parameters: [address: `0x${string}`, index: `0x${string}`, value: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_stopImpersonatingAccount" | "ganache_stopImpersonatingAccount" | "hardhat_stopImpersonatingAccount";
        Parameters: [address: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "anvil_increaseTime" | "ganache_increaseTime" | "hardhat_increaseTime";
        Parameters: [seconds: number];
        ReturnType: `0x${string}`;
    }, {
        Method: "evm_setAccountBalance";
        Parameters: [address: `0x${string}`, value: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_setAutomine";
        Parameters: [boolean];
        ReturnType: void;
    }, {
        Method: "evm_setBlockGasLimit";
        Parameters: [gasLimit: `0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_increaseTime";
        Parameters: [seconds: `0x${string}`];
        ReturnType: `0x${string}`;
    }, {
        Method: "anvil_setBlockTimestampInterval" | "ganache_setBlockTimestampInterval" | "hardhat_setBlockTimestampInterval";
        Parameters: [seconds: number];
        ReturnType: void;
    }, {
        Method: "anvil_removeBlockTimestampInterval" | "ganache_removeBlockTimestampInterval" | "hardhat_removeBlockTimestampInterval";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "evm_setIntervalMining";
        Parameters: [number];
        ReturnType: void;
    }, {
        Method: "evm_setNextBlockTimestamp";
        Parameters: [`0x${string}`];
        ReturnType: void;
    }, {
        Method: "evm_snapshot";
        Parameters?: undefined;
        ReturnType: `0x${string}`;
    }, {
        Method: "evm_revert";
        Parameters?: [id: `0x${string}`] | undefined;
        ReturnType: void;
    }, {
        Method: "miner_start";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "miner_stop";
        Parameters?: undefined;
        ReturnType: void;
    }, {
        Method: "txpool_content";
        Parameters?: undefined;
        ReturnType: {
            pending: Record<`0x${string}`, Record<string, viem.RpcTransaction>>;
            queued: Record<`0x${string}`, Record<string, viem.RpcTransaction>>;
        };
    }, {
        Method: "txpool_inspect";
        Parameters?: undefined;
        ReturnType: {
            pending: Record<`0x${string}`, Record<string, string>>;
            queued: Record<`0x${string}`, Record<string, string>>;
        };
    }, {
        Method: "txpool_status";
        Parameters?: undefined;
        ReturnType: {
            pending: `0x${string}`;
            queued: `0x${string}`;
        };
    }, {
        Method: "eth_mining";
        Parameters?: undefined;
        ReturnType: boolean;
    }, {
        Method: "evm_mine";
        Parameters?: [{
            blocks: `0x${string}`;
        }] | undefined;
        ReturnType: void;
    }, {
        Method: "eth_sendUnsignedTransaction";
        Parameters: [transaction: viem.RpcTransactionRequest];
        ReturnType: `0x${string}`;
    }, {
        Method: "tevm_call";
        Parameters: [params: {
            data?: `0x${string}`;
            deployedBytecode?: `0x${string}`;
            value?: `0x${string}`;
            from?: `0x${string}`;
            to?: `0x${string}`;
            gasPrice?: `0x${string}`;
            gas?: `0x${string}`;
            blobVersionedHashes?: `0x${string}`[];
            blockTag?: `0x${string}` | _tevm_actions_types.BlockTag;
            gasRefund?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            throwOnFail?: boolean;
            createTrace?: boolean;
            createAccessList?: boolean;
            createTransaction?: boolean | "on-success" | "always" | "never";
            skipBalance?: boolean;
            origin?: `0x${string}`;
            caller?: `0x${string}`;
            depth?: number;
            salt?: `0x${string}`;
        }, stateOverrideSet?: {
            [x: `0x${string}`]: {
                balance?: `0x${string}`;
                nonce?: `0x${string}`;
                code?: `0x${string}`;
                state?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
                stateDiff?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
            };
        } | undefined, blockOverrideSet?: {
            number?: `0x${string}`;
            time?: `0x${string}`;
            gasLimit?: `0x${string}`;
            coinbase?: `0x${string}`;
            baseFee?: `0x${string}`;
            blobBaseFee?: `0x${string}`;
        } | undefined];
        ReturnType: {
            trace?: {
                readonly failed: boolean;
                readonly gas: `0x${string}`;
                readonly returnValue: `0x${string}`;
                readonly structLogs: {
                    readonly depth: number;
                    readonly gas: `0x${string}`;
                    readonly gasCost: `0x${string}`;
                    readonly op: string;
                    readonly pc: number;
                    readonly stack: `0x${string}`[];
                    readonly error?: {
                        error: string;
                        errorType: string;
                    };
                }[];
            };
            accessList?: {
                [x: `0x${string}`]: readonly `0x${string}`[];
            };
            txHash?: `0x${string}`;
            gas?: `0x${string}`;
            executionGasUsed: `0x${string}`;
            logs?: {
                readonly address: `0x${string}`;
                readonly topics: `0x${string}`[];
                readonly data: `0x${string}`;
            }[];
            gasRefund?: `0x${string}`;
            blobGasUsed?: `0x${string}`;
            createdAddress?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            createdAddresses?: readonly `0x${string}`[];
            rawData: `0x${string}`;
            errors?: never[];
        };
    }, {
        Method: "tevm_script";
        Parameters: [params: {
            value?: `0x${string}`;
            from?: `0x${string}`;
            to?: `0x${string}`;
            gasPrice?: `0x${string}`;
            gas?: `0x${string}`;
            blobVersionedHashes?: `0x${string}`[];
            blockTag?: `0x${string}` | _tevm_actions_types.BlockTag;
            gasRefund?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            throwOnFail?: boolean;
            createTrace?: boolean;
            createAccessList?: boolean;
            createTransaction?: boolean | "on-success" | "always" | "never";
            skipBalance?: boolean;
            origin?: `0x${string}`;
            caller?: `0x${string}`;
            depth?: number;
        } & {
            data: `0x${string}`;
            deployedBytecode: `0x${string}`;
        }, stateOverrideSet?: {
            [x: `0x${string}`]: {
                balance?: `0x${string}`;
                nonce?: `0x${string}`;
                code?: `0x${string}`;
                state?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
                stateDiff?: {
                    [x: `0x${string}`]: `0x${string}`;
                };
            };
        } | undefined, blockOverrideSet?: {
            number?: `0x${string}`;
            time?: `0x${string}`;
            gasLimit?: `0x${string}`;
            coinbase?: `0x${string}`;
            baseFee?: `0x${string}`;
            blobBaseFee?: `0x${string}`;
        } | undefined];
        ReturnType: {
            trace?: {
                readonly failed: boolean;
                readonly gas: `0x${string}`;
                readonly returnValue: `0x${string}`;
                readonly structLogs: {
                    readonly depth: number;
                    readonly gas: `0x${string}`;
                    readonly gasCost: `0x${string}`;
                    readonly op: string;
                    readonly pc: number;
                    readonly stack: `0x${string}`[];
                    readonly error?: {
                        error: string;
                        errorType: string;
                    };
                }[];
            };
            accessList?: {
                [x: `0x${string}`]: readonly `0x${string}`[];
            };
            txHash?: `0x${string}`;
            gas?: `0x${string}`;
            executionGasUsed: `0x${string}`;
            logs?: {
                readonly address: `0x${string}`;
                readonly topics: `0x${string}`[];
                readonly data: `0x${string}`;
            }[];
            gasRefund?: `0x${string}`;
            blobGasUsed?: `0x${string}`;
            createdAddress?: `0x${string}`;
            selfdestruct?: readonly `0x${string}`[];
            createdAddresses?: readonly `0x${string}`[];
            rawData: `0x${string}`;
            errors?: never[];
        };
    }, {
        Method: "tevm_dumpState";
        Parameters?: [] | undefined;
        ReturnType: _tevm_actions_types.DumpStateResult<never>;
    }, {
        Method: "tevm_loadState";
        Parameters: [_tevm_procedures_types.SerializedParams];
        ReturnType: {
            errors?: never[];
        };
    }, {
        Method: "tevm_getAccount";
        Parameters: [{
            throwOnFail?: boolean;
            address: `0x${string}`;
            returnStorage?: boolean;
        }];
        ReturnType: {
            errors?: never[];
            address: `0x${string}`;
            nonce: `0x${string}`;
            balance: `0x${string}`;
            deployedBytecode: `0x${string}`;
            storageRoot: `0x${string}`;
            codeHash: `0x${string}`;
            isContract: boolean;
            isEmpty: boolean;
            storage?: {
                [x: `0x${string}`]: `0x${string}`;
            };
        };
    }, {
        Method: "tevm_setAccount";
        Parameters: [{
            throwOnFail?: boolean;
            address: `0x${string}`;
            nonce?: `0x${string}`;
            balance?: `0x${string}`;
            deployedBytecode?: `0x${string}`;
            storageRoot?: `0x${string}`;
            state?: {
                [x: `0x${string}`]: `0x${string}`;
            };
            stateDiff?: {
                [x: `0x${string}`]: `0x${string}`;
            };
        }];
        ReturnType: {
            errors?: never[];
        };
    }], { [K_2 in keyof client]: client[K_2]; } & viem.PublicActions & _tevm_memory_client.TevmActions>;
};
type L1Client = ReturnType<typeof createL1Client>;

export { BaseFeeVaultAbi, BaseFeeVaultAddresses, BaseFeeVaultBytecode, BaseFeeVaultDeployedBytecode, BaseFeeVaultHumanReadableAbi, DelayedVetoableAbi, DelayedVetoableAddresses, DelayedVetoableBytecode, DelayedVetoableDeployedBytecode, DelayedVetoableHumanReadableAbi, DisputeGameFactoryAbi, DisputeGameFactoryAddresses, DisputeGameFactoryBytecode, DisputeGameFactoryDeployedBytecode, DisputeGameFactoryHumanReadableAbi, GasPriceOracleAbi, GasPriceOracleAddresses, GasPriceOracleBytecode, GasPriceOracleDeployedBytecode, GasPriceOracleHumanReadableAbi, L1BlockAbi, L1BlockAddresses, L1BlockBytecode, L1BlockDeployedBytecode, L1BlockHumanReadableAbi, type L1Client, L1CrossDomainMessengerAbi, L1CrossDomainMessengerAddresses, L1CrossDomainMessengerBytecode, L1CrossDomainMessengerDeployedBytecode, L1CrossDomainMessengerHumanReadableAbi, L1ERC721BridgeAbi, L1ERC721BridgeAddresses, L1ERC721BridgeBytecode, L1ERC721BridgeDeployedBytecode, L1ERC721BridgeHumanReadableAbi, L1FeeVaultAbi, L1FeeVaultAddresses, L1FeeVaultBytecode, L1FeeVaultDeployedBytecode, L1FeeVaultHumanReadableAbi, L1StandardBridgeAbi, L1StandardBridgeAddresses, L1StandardBridgeBytecode, L1StandardBridgeDeployedBytecode, L1StandardBridgeHumanReadableAbi, L2CrossDomainMessengerAbi, L2CrossDomainMessengerAddresses, L2CrossDomainMessengerBytecode, L2CrossDomainMessengerDeployedBytecode, L2CrossDomainMessengerHumanReadableAbi, L2ERC721BridgeAbi, L2ERC721BridgeAddresses, L2ERC721BridgeBytecode, L2ERC721BridgeDeployedBytecode, L2ERC721BridgeHumanReadableAbi, L2OutputOracleAbi, L2OutputOracleAddresses, L2OutputOracleBytecode, L2OutputOracleDeployedBytecode, L2OutputOracleHumanReadableAbi, L2StandardBridgeAbi, L2StandardBridgeAddresses, L2StandardBridgeBytecode, L2StandardBridgeDeployedBytecode, L2StandardBridgeHumanReadableAbi, L2ToL1MessagePasserAbi, L2ToL1MessagePasserAddresses, L2ToL1MessagePasserBytecode, L2ToL1MessagePasserDeployedBytecode, L2ToL1MessagePasserHumanReadableAbi, OptimismMintableERC20FactoryAbi, OptimismMintableERC20FactoryAddresses, OptimismMintableERC20FactoryBytecode, OptimismMintableERC20FactoryDeployedBytecode, OptimismMintableERC20FactoryHumanReadableAbi, OptimismPortal2Abi, OptimismPortal2Addresses, OptimismPortal2Bytecode, OptimismPortal2DeployedBytecode, OptimismPortal2HumanReadableAbi, ProtocolVersionsAbi, ProtocolVersionsAddresses, ProtocolVersionsBytecode, ProtocolVersionsDeployedBytecode, ProtocolVersionsHumanReadableAbi, SequencerFeeVaultAbi, SequencerFeeVaultAddresses, SequencerFeeVaultBytecode, SequencerFeeVaultDeployedBytecode, SequencerFeeVaultHumanReadableAbi, SuperchainConfigAbi, SuperchainConfigAddresses, SuperchainConfigBytecode, SuperchainConfigDeployedBytecode, SuperchainConfigHumanReadableAbi, SystemConfigAbi, SystemConfigAddresses, SystemConfigBytecode, SystemConfigDeployedBytecode, SystemConfigHumanReadableAbi, constants, createBaseFeeVault, createDelayedVetoable, createDisputeGameFactory, createGasPriceOracle, createL1Block, createL1Client, createL1CrossDomainMessenger, createL1ERC721Bridge, createL1FeeVault, createL1StandardBridge, createL2CrossDomainMessenger, createL2ERC721Bridge, createL2OutputOracle, createL2StandardBridge, createL2ToL1MessagePasser, createOptimismMintableERC20Factory, createOptimismPortal2, createProtocolVersions, createSequencerFeeVault, createSuperchainConfig, createSystemConfig };
