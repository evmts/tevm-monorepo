import { BaseFeeScalarError, Eip1559FeesNotSupportedError, } from '../../errors/fee.js';
import { internal_estimateMaxPriorityFeePerGas } from './estimateMaxPriorityFeePerGas.js';
import { getBlock } from './getBlock.js';
import { getGasPrice } from './getGasPrice.js';
/**
 * Returns an estimate for the fees per gas (in wei) for a
 * transaction to be likely included in the next block.
 * Defaults to [`chain.fees.estimateFeesPerGas`](/docs/clients/chains.html#fees-estimatefeespergas) if set.
 *
 * - Docs: https://viem.sh/docs/actions/public/estimateFeesPerGas.html
 *
 * @param client - Client to use
 * @param parameters - {@link EstimateFeesPerGasParameters}
 * @returns An estimate (in wei) for the fees per gas. {@link EstimateFeesPerGasReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { estimateFeesPerGas } from 'viem/actions'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const maxPriorityFeePerGas = await estimateFeesPerGas(client)
 * // { maxFeePerGas: ..., maxPriorityFeePerGas: ... }
 */
export async function estimateFeesPerGas(client, args) {
    return internal_estimateFeesPerGas(client, args);
}
export async function internal_estimateFeesPerGas(client, args) {
    const { block: block_, chain = client.chain, request, type = 'eip1559', } = args || {};
    const baseFeeMultiplier = await (async () => {
        if (typeof chain?.fees?.baseFeeMultiplier === 'function')
            return chain.fees.baseFeeMultiplier({
                block: block_,
                client,
                request,
            });
        return chain?.fees?.baseFeeMultiplier ?? 1.2;
    })();
    if (baseFeeMultiplier < 1)
        throw new BaseFeeScalarError();
    const decimals = baseFeeMultiplier.toString().split('.')[1].length;
    const denominator = 10 ** decimals;
    const multiply = (base) => (base * BigInt(baseFeeMultiplier * denominator)) / BigInt(denominator);
    const block = block_ ? block_ : await getBlock(client);
    if (typeof chain?.fees?.estimateFeesPerGas === 'function')
        return chain.fees.estimateFeesPerGas({
            block: block_,
            client,
            multiply,
            request,
            type,
        });
    if (type === 'eip1559') {
        if (typeof block.baseFeePerGas !== 'bigint')
            throw new Eip1559FeesNotSupportedError();
        const maxPriorityFeePerGas = request?.maxPriorityFeePerGas
            ? request.maxPriorityFeePerGas
            : await internal_estimateMaxPriorityFeePerGas(client, {
                block,
                chain,
                request,
            });
        const baseFeePerGas = multiply(block.baseFeePerGas);
        const maxFeePerGas = request?.maxFeePerGas ?? baseFeePerGas + maxPriorityFeePerGas;
        return {
            maxFeePerGas,
            maxPriorityFeePerGas,
        };
    }
    const gasPrice = request?.gasPrice ?? multiply(await getGasPrice(client));
    return {
        gasPrice,
    };
}
//# sourceMappingURL=estimateFeesPerGas.js.map