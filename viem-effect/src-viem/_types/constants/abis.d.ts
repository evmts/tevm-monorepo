export declare const multicall3Abi: readonly [{
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly name: "target";
            readonly type: "address";
        }, {
            readonly name: "allowFailure";
            readonly type: "bool";
        }, {
            readonly name: "callData";
            readonly type: "bytes";
        }];
        readonly name: "calls";
        readonly type: "tuple[]";
    }];
    readonly name: "aggregate3";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly name: "success";
            readonly type: "bool";
        }, {
            readonly name: "returnData";
            readonly type: "bytes";
        }];
        readonly name: "returnData";
        readonly type: "tuple[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
export declare const universalResolverResolveAbi: readonly [{
    readonly inputs: readonly [];
    readonly name: "ResolverNotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverWildcardNotSupported";
    readonly type: "error";
}, {
    readonly name: "resolve";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes";
    }, {
        readonly name: "address";
        readonly type: "address";
    }];
}];
export declare const universalResolverReverseAbi: readonly [{
    readonly inputs: readonly [];
    readonly name: "ResolverNotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ResolverWildcardNotSupported";
    readonly type: "error";
}, {
    readonly name: "reverse";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "bytes";
        readonly name: "reverseName";
    }];
    readonly outputs: readonly [{
        readonly type: "string";
        readonly name: "resolvedName";
    }, {
        readonly type: "address";
        readonly name: "resolvedAddress";
    }, {
        readonly type: "address";
        readonly name: "reverseResolver";
    }, {
        readonly type: "address";
        readonly name: "resolver";
    }];
}];
export declare const textResolverAbi: readonly [{
    readonly name: "text";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "bytes32";
    }, {
        readonly name: "key";
        readonly type: "string";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
    }];
}];
export declare const addressResolverAbi: readonly [{
    readonly name: "addr";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
    }];
}, {
    readonly name: "addr";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "bytes32";
    }, {
        readonly name: "coinType";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes";
    }];
}];
export declare const smartAccountAbi: readonly [{
    readonly name: "isValidSignature";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "hash";
        readonly type: "bytes32";
    }, {
        readonly name: "signature";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes4";
    }];
}];
export declare const universalSignatureValidatorAbi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_signer";
        readonly type: "address";
    }, {
        readonly internalType: "bytes32";
        readonly name: "_hash";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes";
        readonly name: "_signature";
        readonly type: "bytes";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}];
//# sourceMappingURL=abis.d.ts.map