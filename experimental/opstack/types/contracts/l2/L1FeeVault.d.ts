/**
 * Creates a L1FeeVault contract instance from a chainId
 * Currently only supports chainId 10
 * @example
 * import { createL1FeeVault } from '@tevm/opstack'
 * const L1FeeVault = createL1FeeVault()
 */
export declare const createL1FeeVault: (chainId?: 10) => Omit<import("@tevm/contract").Script<"L1FeeVault", readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"]>, "address" | "events" | "read" | "write"> & {
    address: "0x420000000000000000000000000000000000001a";
    events: import("@tevm/contract").EventActionCreator<readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"], `0x${string}`, `0x${string}`, "0x420000000000000000000000000000000000001a">;
    read: import("@tevm/contract").ReadActionCreator<readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"], `0x${string}`, `0x${string}`, "0x420000000000000000000000000000000000001a">;
    write: import("@tevm/contract").WriteActionCreator<readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"], `0x${string}`, `0x${string}`, "0x420000000000000000000000000000000000001a">;
};
export declare const L1FeeVaultAddresses: {
    readonly '10': "0x420000000000000000000000000000000000001a";
};
export declare const L1FeeVaultBytecode: `0x${string}`;
export declare const L1FeeVaultDeployedBytecode: `0x${string}`;
export declare const L1FeeVaultHumanReadableAbi: readonly ["constructor(address _recipient, uint256 _minWithdrawalAmount, uint8 _withdrawalNetwork)", "receive() external payable", "function MIN_WITHDRAWAL_AMOUNT() view returns (uint256)", "function RECIPIENT() view returns (address)", "function WITHDRAWAL_NETWORK() view returns (uint8)", "function totalProcessed() view returns (uint256)", "function version() view returns (string)", "function withdraw()", "event Withdrawal(uint256 value, address to, address from)", "event Withdrawal(uint256 value, address to, address from, uint8 withdrawalNetwork)"];
export declare const L1FeeVaultAbi: readonly [{
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
//# sourceMappingURL=L1FeeVault.d.ts.map