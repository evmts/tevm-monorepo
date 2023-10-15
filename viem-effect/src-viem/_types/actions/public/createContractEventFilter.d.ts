import type { Abi, Address } from 'abitype';
import type { Client } from '../../clients/createClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { BlockNumber, BlockTag } from '../../types/block.js';
import type { Chain } from '../../types/chain.js';
import type { InferEventName, MaybeExtractEventArgsFromAbi } from '../../types/contract.js';
import type { Filter } from '../../types/filter.js';
export type CreateContractEventFilterParameters<TAbi extends Abi | readonly unknown[] = Abi, TEventName extends string | undefined = undefined, TArgs extends MaybeExtractEventArgsFromAbi<TAbi, TEventName> | undefined = undefined, TStrict extends boolean | undefined = undefined, TFromBlock extends BlockNumber | BlockTag | undefined = undefined, TToBlock extends BlockNumber | BlockTag | undefined = undefined> = {
    address?: Address | Address[];
    abi: TAbi;
    eventName?: InferEventName<TAbi, TEventName>;
    fromBlock?: TFromBlock | BlockNumber | BlockTag;
    /**
     * Whether or not the logs must match the indexed/non-indexed arguments in the event ABI item.
     * @default false
     */
    strict?: TStrict;
    toBlock?: TToBlock | BlockNumber | BlockTag;
} & (undefined extends TEventName ? {
    args?: never;
} : MaybeExtractEventArgsFromAbi<TAbi, TEventName> extends infer TEventFilterArgs ? {
    args?: TEventFilterArgs | (TArgs extends TEventFilterArgs ? TArgs : never);
} : {
    args?: never;
});
export type CreateContractEventFilterReturnType<TAbi extends Abi | readonly unknown[] = Abi, TEventName extends string | undefined = undefined, TArgs extends MaybeExtractEventArgsFromAbi<TAbi, TEventName> | undefined = undefined, TStrict extends boolean | undefined = undefined, TFromBlock extends BlockNumber | BlockTag | undefined = undefined, TToBlock extends BlockNumber | BlockTag | undefined = undefined> = Filter<'event', TAbi, TEventName, TArgs, TStrict, TFromBlock, TToBlock>;
/**
 * Creates a Filter to retrieve event logs that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges.html) or [`getFilterLogs`](https://viem.sh/docs/actions/public/getFilterLogs.html).
 *
 * - Docs: https://viem.sh/docs/contract/createContractEventFilter.html
 *
 * @param client - Client to use
 * @param parameters - {@link CreateContractEventFilterParameters}
 * @returns [`Filter`](https://viem.sh/docs/glossary/types.html#filter). {@link CreateContractEventFilterReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createContractEventFilter } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createContractEventFilter(client, {
 *   abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']),
 * })
 */
export declare function createContractEventFilter<TChain extends Chain | undefined, const TAbi extends Abi | readonly unknown[], TEventName extends string | undefined, TArgs extends MaybeExtractEventArgsFromAbi<TAbi, TEventName> | undefined, TStrict extends boolean | undefined = undefined, TFromBlock extends BlockNumber | BlockTag | undefined = undefined, TToBlock extends BlockNumber | BlockTag | undefined = undefined>(client: Client<Transport, TChain>, { address, abi, args, eventName, fromBlock, strict, toBlock, }: CreateContractEventFilterParameters<TAbi, TEventName, TArgs, TStrict, TFromBlock, TToBlock>): Promise<CreateContractEventFilterReturnType<TAbi, TEventName, TArgs, TStrict, TFromBlock, TToBlock>>;
//# sourceMappingURL=createContractEventFilter.d.ts.map