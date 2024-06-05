/**
 * Creates a L1StandardBridge contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL1StandardBridge } from '@tevm/opstack'
 * const L1StandardBridge = createL1StandardBridge()
 */
export declare const createL1StandardBridge: (chainId?: 10) => Omit<import("@tevm/contract").Script<"L1StandardBridge", readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1";
    events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1">;
    read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1">;
    write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1">;
};
export declare const L1StandardBridgeAddresses: {
    readonly '10': "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1";
};
export declare const L1StandardBridgeBytecode: `0x${string}`;
export declare const L1StandardBridgeDeployedBytecode: `0x${string}`;
export declare const L1StandardBridgeHumanReadableAbi: readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function depositERC20(address _l1Token, address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function depositETH(uint32 _minGasLimit, bytes _extraData) payable", "function depositETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeERC20Withdrawal(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeETHWithdrawal(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _messenger, address _superchainConfig)", "function l2TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20WithdrawalFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHDepositInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHWithdrawalFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)"];
export declare const L1StandardBridgeAbi: readonly [{
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
//# sourceMappingURL=L1StandardBridge.d.ts.map