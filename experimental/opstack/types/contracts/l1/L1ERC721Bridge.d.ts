/**
 * Creates a L1ERC721Bridge contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL1ERC721Bridge } from '@tevm/opstack'
 * const L1ERC721Bridge = createL1ERC721Bridge()
 */
export declare const createL1ERC721Bridge: (chainId?: 10) => Omit<import("@tevm/contract").Script<"L1ERC721Bridge", readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D";
    events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D">;
    read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D">;
    write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"], `0x${string}`, `0x${string}`, "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D">;
};
export declare const L1ERC721BridgeAddresses: {
    readonly '10': "0x5a7749f83b81B301cAb5f48EB8516B986DAef23D";
};
export declare const L1ERC721BridgeBytecode: `0x${string}`;
export declare const L1ERC721BridgeDeployedBytecode: `0x${string}`;
export declare const L1ERC721BridgeHumanReadableAbi: readonly ["constructor()", "function MESSENGER() view returns (address)", "function OTHER_BRIDGE() view returns (address)", "function bridgeERC721(address _localToken, address _remoteToken, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function bridgeERC721To(address _localToken, address _remoteToken, address _to, uint256 _tokenId, uint32 _minGasLimit, bytes _extraData)", "function deposits(address, address, uint256) view returns (bool)", "function finalizeBridgeERC721(address _localToken, address _remoteToken, address _from, address _to, uint256 _tokenId, bytes _extraData)", "function initialize(address _messenger, address _superchainConfig)", "function messenger() view returns (address)", "function otherBridge() view returns (address)", "function paused() view returns (bool)", "function superchainConfig() view returns (address)", "function version() view returns (string)", "event ERC721BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event ERC721BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 tokenId, bytes extraData)", "event Initialized(uint8 version)"];
export declare const L1ERC721BridgeAbi: readonly [{
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
//# sourceMappingURL=L1ERC721Bridge.d.ts.map