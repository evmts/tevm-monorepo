/**
 * Creates a L2StandardBridge contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL2StandardBridge } from '@tevm/opstack'
 * const L2StandardBridge = createL2StandardBridge()
 */
export declare const createL2StandardBridge: (chainId?: 10) => Omit<import("@tevm/contract").Script<"L2StandardBridge", readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeDeposit(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _otherBridge)", "function l1TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function version() view returns (string)", "function withdraw(address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "function withdrawTo(address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)", "event WithdrawalInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x4200000000000000000000000000000000000010";
    events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeDeposit(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _otherBridge)", "function l1TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function version() view returns (string)", "function withdraw(address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "function withdrawTo(address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)", "event WithdrawalInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000010">;
    read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeDeposit(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _otherBridge)", "function l1TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function version() view returns (string)", "function withdraw(address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "function withdrawTo(address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)", "event WithdrawalInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000010">;
    write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeDeposit(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _otherBridge)", "function l1TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function version() view returns (string)", "function withdraw(address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "function withdrawTo(address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)", "event WithdrawalInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000010">;
};
export declare const L2StandardBridgeAddresses: {
    readonly '10': "0x4200000000000000000000000000000000000010";
};
export declare const L2StandardBridgeBytecode: `0x${string}`;
export declare const L2StandardBridgeDeployedBytecode: `0x${string}`;
export declare const L2StandardBridgeHumanReadableAbi: readonly ["constructor()", "receive() external payable", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData)", "function bridgeETH(uint32 _minGasLimit, bytes _extraData) payable", "function bridgeETHTo(address _to, uint32 _minGasLimit, bytes _extraData) payable", "function deposits(address, address) view returns (uint256)", "function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes _extraData)", "function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes _extraData) payable", "function finalizeDeposit(address _l1Token, address _l2Token, address _from, address _to, uint256 _amount, bytes _extraData) payable", "function initialize(address _otherBridge)", "function l1TokenBridge() view returns (address)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function version() view returns (string)", "function withdraw(address _l2Token, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "function withdrawTo(address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes _extraData) payable", "event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)", "event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)", "event Initialized(uint8 version)", "event WithdrawalInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)"];
export declare const L2StandardBridgeAbi: readonly [{
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
//# sourceMappingURL=L2StandardBridge.d.ts.map