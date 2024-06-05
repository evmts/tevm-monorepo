/**
 * Creates a BaseFeeVault contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createBaseFeeVault } from '@tevm/opstack'
 * const BaseFeeVault = createBaseFeeVault()
 */
export declare const createBaseFeeVault: (chainId?: 10) => Omit<import("@tevm/contract").Script<"BaseFeeVault", readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x4200000000000000000000000000000000000019";
    events: import("@tevm/contract").EventActionCreator<readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000019">;
    read: import("@tevm/contract").ReadActionCreator<readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000019">;
    write: import("@tevm/contract").WriteActionCreator<readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"], `0x${string}`, `0x${string}`, "0x4200000000000000000000000000000000000019">;
};
export declare const BaseFeeVaultAddresses: {
    readonly '10': "0x4200000000000000000000000000000000000019";
};
export declare const BaseFeeVaultBytecode: `0x${string}`;
export declare const BaseFeeVaultDeployedBytecode: `0x${string}`;
export declare const BaseFeeVaultHumanReadableAbi: readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"];
export declare const BaseFeeVaultAbi: readonly [{
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
//# sourceMappingURL=BaseFeeVault.d.ts.map