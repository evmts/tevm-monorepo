import { Address as EthjsAddress } from '@ethereumjs/util';
import { type TevmContract } from '@tevm/contract';
import { type Address } from 'abitype';
export type CustomPredeploy = {
    address: Address;
    contract: TevmContract;
};
export declare abstract class Predeploy<TName extends string, THumanReadableAbi extends readonly string[], TBytecode extends `0x${string}` | undefined, TDeployedBytecode extends `0x${string}` | undefined> {
    abstract readonly contract: TevmContract<TName, THumanReadableAbi, TBytecode, TDeployedBytecode>;
    abstract readonly address: Address;
    protected readonly ethjsAddress: () => EthjsAddress;
    readonly predeploy: () => {
        address: EthjsAddress;
    };
}
export declare const definePredeploy: <TName extends string, THumanReadableAbi extends readonly string[], TBytecode extends `0x${string}` | undefined, TDeployedBytecode extends `0x${string}` | undefined>({ contract, address, }: Pick<Predeploy<TName, THumanReadableAbi, TBytecode, TDeployedBytecode>, "address" | "contract">) => Predeploy<TName, THumanReadableAbi, TBytecode, TDeployedBytecode>;
//# sourceMappingURL=definePredeploy.d.ts.map