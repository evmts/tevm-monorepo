import { AbiErrorInputsNotFoundError, AbiErrorNotFoundError, } from '../../errors/abi.js';
import { concatHex } from '../data/concat.js';
import { getFunctionSelector } from '../hash/getFunctionSelector.js';
import { encodeAbiParameters } from './encodeAbiParameters.js';
import { formatAbiItem } from './formatAbiItem.js';
import { getAbiItem } from './getAbiItem.js';
const docsPath = '/docs/contract/encodeErrorResult';
export function encodeErrorResult({ abi, errorName, args }) {
    let abiItem = abi[0];
    if (errorName) {
        abiItem = getAbiItem({
            abi,
            args,
            name: errorName,
        });
        if (!abiItem)
            throw new AbiErrorNotFoundError(errorName, { docsPath });
    }
    if (abiItem.type !== 'error')
        throw new AbiErrorNotFoundError(undefined, { docsPath });
    const definition = formatAbiItem(abiItem);
    const signature = getFunctionSelector(definition);
    let data = '0x';
    if (args && args.length > 0) {
        if (!abiItem.inputs)
            throw new AbiErrorInputsNotFoundError(abiItem.name, { docsPath });
        data = encodeAbiParameters(abiItem.inputs, args);
    }
    return concatHex([signature, data]);
}
//# sourceMappingURL=encodeErrorResult.js.map