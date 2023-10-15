import { BaseError } from './base.js';
export declare class EnsAvatarInvalidMetadataError extends BaseError {
    name: string;
    constructor({ data }: {
        data: any;
    });
}
export declare class EnsAvatarInvalidNftUriError extends BaseError {
    name: string;
    constructor({ reason }: {
        reason: string;
    });
}
export declare class EnsAvatarUriResolutionError extends BaseError {
    name: string;
    constructor({ uri }: {
        uri: string;
    });
}
export declare class EnsAvatarUnsupportedNamespaceError extends BaseError {
    name: string;
    constructor({ namespace }: {
        namespace: string;
    });
}
//# sourceMappingURL=ens.d.ts.map