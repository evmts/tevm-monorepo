/**
 * Creates a DisputeGameFactory contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createDisputeGameFactory } from '@tevm/opstack'
 * const DisputeGameFactory = createDisputeGameFactory()
 */
export declare const createDisputeGameFactory: (chainId?: 10) => Omit<import("@tevm/contract").Script<"DisputeGameFactory", readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x6901690169016901690169016901690169016901";
    events: import("@tevm/contract").EventActionCreator<readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"], `0x${string}`, `0x${string}`, "0x6901690169016901690169016901690169016901">;
    read: import("@tevm/contract").ReadActionCreator<readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"], `0x${string}`, `0x${string}`, "0x6901690169016901690169016901690169016901">;
    write: import("@tevm/contract").WriteActionCreator<readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"], `0x${string}`, `0x${string}`, "0x6901690169016901690169016901690169016901">;
};
export declare const DisputeGameFactoryAddresses: {
    readonly '10': "0x6901690169016901690169016901690169016901";
};
export declare const DisputeGameFactoryBytecode: `0x${string}`;
export declare const DisputeGameFactoryDeployedBytecode: `0x${string}`;
export declare const DisputeGameFactoryHumanReadableAbi: readonly ["constructor()", "function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)", "function findLatestGames(uint32 _gameType, uint256 _start, uint256 _n) view returns ((uint256 index, bytes32 metadata, uint64 timestamp, bytes32 rootClaim, bytes extraData)[] games_)", "function gameAtIndex(uint256 _index) view returns (uint32 gameType_, uint64 timestamp_, address proxy_)", "function gameCount() view returns (uint256 gameCount_)", "function gameImpls(uint32) view returns (address)", "function games(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) view returns (address proxy_, uint64 timestamp_)", "function getGameUUID(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) pure returns (bytes32 uuid_)", "function initBonds(uint32) view returns (uint256)", "function initialize(address _owner)", "function owner() view returns (address)", "function renounceOwnership()", "function setImplementation(uint32 _gameType, address _impl)", "function setInitBond(uint32 _gameType, uint256 _initBond)", "function transferOwnership(address newOwner)", "function version() view returns (string)", "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)", "event ImplementationSet(address indexed impl, uint32 indexed gameType)", "event InitBondUpdated(uint32 indexed gameType, uint256 indexed newBond)", "event Initialized(uint8 version)", "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)", "error GameAlreadyExists(bytes32 uuid)", "error InsufficientBond()", "error NoImplementation(uint32 gameType)"];
export declare const DisputeGameFactoryAbi: readonly [{
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
//# sourceMappingURL=DisputeGameFactory.d.ts.map