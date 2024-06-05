/**
 * Creates a OptimismMintableERC20Factory contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createOptimismMintableERC20Factory } from '@tevm/opstack'
 * const OptimismMintableERC20Factory = createOptimismMintableERC20Factory()
 */
export declare const createOptimismMintableERC20Factory: (chainId?: 10) => Omit<import("@tevm/contract").Script<"OptimismMintableERC20Factory", readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x75505a97BD334E7BD3C476893285569C4136Fa0F";
    events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"], `0x${string}`, `0x${string}`, "0x75505a97BD334E7BD3C476893285569C4136Fa0F">;
    read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"], `0x${string}`, `0x${string}`, "0x75505a97BD334E7BD3C476893285569C4136Fa0F">;
    write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"], `0x${string}`, `0x${string}`, "0x75505a97BD334E7BD3C476893285569C4136Fa0F">;
};
export declare const OptimismMintableERC20FactoryAddresses: {
    readonly '10': "0x75505a97BD334E7BD3C476893285569C4136Fa0F";
};
export declare const OptimismMintableERC20FactoryBytecode: `0x${string}`;
export declare const OptimismMintableERC20FactoryDeployedBytecode: `0x${string}`;
export declare const OptimismMintableERC20FactoryHumanReadableAbi: readonly ["constructor()", "function BRIDGE() view returns (address)", "function bridge() view returns (address)", "function createOptimismMintableERC20(address _remoteToken, string _name, string _symbol) returns (address)", "function createOptimismMintableERC20WithDecimals(address _remoteToken, string _name, string _symbol, uint8 _decimals) returns (address)", "function createStandardL2Token(address _remoteToken, string _name, string _symbol) returns (address)", "function initialize(address _bridge)", "function version() view returns (string)", "event Initialized(uint8 version)", "event OptimismMintableERC20Created(address indexed localToken, address indexed remoteToken, address deployer)", "event StandardL2TokenCreated(address indexed remoteToken, address indexed localToken)"];
export declare const OptimismMintableERC20FactoryAbi: readonly [{
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
//# sourceMappingURL=OptimismMintableERC20Factory.d.ts.map