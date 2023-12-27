import { type PutAccountAction, type PutContractCodeAction, type RunCallAction, type RunContractCallAction, type RunContractCallResult, type RunScriptAction, type RunScriptResult } from './actions/index.js';
import type { Abi } from 'abitype';
/**
 * Options fetch state that isn't available locally.
 */
type ForkOptions = {
    /**
     * A viem PublicClient to use for the EVM.
     * It will be used to fetch state that isn't available locally.
     */
    url: string;
    /**
     * The block tag to use for the EVM.
     * If not passed it will start from the latest
     * block at the time of forking
     */
    blockTag?: bigint;
};
/**
 * Options for creating an EVMts instance
 */
export type CreateEVMOptions = {
    fork?: ForkOptions;
    customPrecompiles?: CustomPrecompile[];
};
/**
 * Infers the the first argument of a class
 */
type ConstructorArgument<T> = T extends new (...args: infer P) => any ? P[0] : never;
/**
 * TODO This should be publically exported from ethereumjs but isn't
 * Typing this by hand is tedious so we are using some typescript inference to get it
 * do a pr to export this from ethereumjs and then replace this with an import
 * TODO this should be modified to take a hex address rather than an ethjs address to be consistent with rest of EVMts
 */
export type CustomPrecompile = Exclude<Exclude<ConstructorArgument<typeof import('@ethereumjs/evm').EVM>, undefined>['customPrecompiles'], undefined>[number];
/**
 * A local EVM instance running in JavaScript. Similar to Anvil in your browser
 * @example
 * ```ts
 * import { EVMts } from "evmts"
 * import { createPublicClient, http } from "viem"
 * import { MyERC721 } from './MyERC721.sol'
 *
 * const evmts = EVMts.create({
 * 	fork: {
 * 	  url: "https://mainnet.optimism.io",
 * 	},
 * })
 *
 * const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
 
 * await evmts.runContractCall(
 *   MyERC721.write.mint({
 *     caller: address,
 *   }),
 * )
 *
 * const balance = await evmts.runContractCall(
 *  MyERC721.read.balanceOf({
 *  caller: address,
 *  }),
 *  )
 *  console.log(balance) // 1n
 *  ```
 */
export declare class EVMts {
    readonly _evm: import('@ethereumjs/evm').EVM;
    /**
     * Makes sure evmts is invoked with EVMts.create and not with new EVMts
     */
    private static isCreating;
    /**
     * Creates a {@link EVMts} instance
     */
    static readonly create: (options?: CreateEVMOptions) => Promise<EVMts>;
    /**
     * A local EVM instance running in JavaScript. Similar to Anvil in your browser
     */
    constructor(_evm: import('@ethereumjs/evm').EVM);
    /**
     * Runs a script or contract that is not deployed to the chain
     * The recomended way to use a script is with an EVMts import
     * @example
     * ```ts
     * // Scripts require bytecode
     * import { MyContractOrScript } from './MyContractOrScript.sol' with {
     *   evmts: 'bytecode'
     * }
     * evmts.runScript(
     *   MyContractOrScript.script.run()
     * )
     * ```
     * Scripts can also be called directly via passing in args
     * @example
     * ```ts
     * evmts.runScript({
     *   bytecode,
     *   abi,
     *   functionName: 'run',
     * })
     * ```
     */
    readonly runScript: <TAbi extends readonly unknown[] | Abi = Abi, TFunctionName extends string = string>(action: RunScriptAction<TAbi, TFunctionName>) => Promise<RunScriptResult<TAbi, TFunctionName>>;
    /**
     * Puts an account with ether balance into the state
     * @example
     * ```ts
     * evmts.putAccount({
     * 	address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
     * 	balance: 100n,
     * })
     * ```
     */
    readonly putAccount: (action: PutAccountAction) => Promise<import("@ethereumjs/util").Account>;
    /**
     * Puts a contract into the state
     * @example
     * ```ts
     * evmts.putContract({
     *  bytecode,
     *  contractAddress,
     * })
     * ```
     */
    readonly putContractCode: (action: PutContractCodeAction) => Promise<Uint8Array>;
    /**
     * Executes a call on the EVM
     * @example
     * ```ts
     * const result = await evmts.runCall({
     *   data: '0x...',
     *   caller: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
     *   gasLimit: 1000000n,
     *   value: 10000000000000000n,
     * })
     * ```
     */
    readonly runCall: (action: RunCallAction) => Promise<import("@ethereumjs/evm").EVMResult>;
    /**
     * Calls contract code using an ABI and returns the decoded result
     * @example
     * ```ts
     * const result = await evmts.runContractCall({
     *  abi: MyContract.abi,
     *  contractAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
     *  functionName: 'balanceOf',
     *  args: ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'],
     * })
     * ```
     */
    readonly runContractCall: <TAbi extends readonly unknown[] | Abi = Abi, TFunctionName extends string = string>(action: RunContractCallAction<TAbi, TFunctionName>) => Promise<RunContractCallResult<TAbi, TFunctionName>>;
}
export {};
//# sourceMappingURL=evmts.d.ts.map