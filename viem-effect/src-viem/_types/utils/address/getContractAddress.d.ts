import type { Address } from 'abitype';
import type { ByteArray, Hex } from '../../types/misc.js';
export type GetCreateAddressOptions = {
    from: Address;
    nonce: bigint;
};
export type GetCreate2AddressOptions = {
    bytecode: ByteArray | Hex;
    from: Address;
    salt: ByteArray | Hex;
};
export type GetContractAddressOptions = ({
    opcode?: 'CREATE';
} & GetCreateAddressOptions) | ({
    opcode: 'CREATE2';
} & GetCreate2AddressOptions);
export declare function getContractAddress(opts: GetContractAddressOptions): `0x${string}`;
export declare function getCreateAddress(opts: GetCreateAddressOptions): `0x${string}`;
export declare function getCreate2Address(opts: GetCreate2AddressOptions): `0x${string}`;
//# sourceMappingURL=getContractAddress.d.ts.map