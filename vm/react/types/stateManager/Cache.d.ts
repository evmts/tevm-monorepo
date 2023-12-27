import type { Address as EthjsAddress } from '@ethereumjs/util';
type getContractStorage = (address: EthjsAddress, key: Uint8Array) => Promise<Uint8Array>;
export declare class Cache {
    private map;
    private getContractStorage;
    constructor(getContractStorage: getContractStorage);
    get(address: EthjsAddress, key: Uint8Array): Promise<Uint8Array>;
    put(address: EthjsAddress, key: Uint8Array, value: Uint8Array): void;
    clear(): void;
}
export {};
//# sourceMappingURL=Cache.d.ts.map