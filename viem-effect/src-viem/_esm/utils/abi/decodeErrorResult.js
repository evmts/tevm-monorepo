import { solidityError, solidityPanic } from '../../constants/solidity.js';
import { AbiDecodingZeroDataError, AbiErrorSignatureNotFoundError, } from '../../errors/abi.js';
import { slice } from '../data/slice.js';
import { getFunctionSelector } from '../hash/getFunctionSelector.js';
import { decodeAbiParameters } from './decodeAbiParameters.js';
import { formatAbiItem } from './formatAbiItem.js';
export function decodeErrorResult({ abi, data, }) {
    const signature = slice(data, 0, 4);
    if (signature === '0x')
        throw new AbiDecodingZeroDataError();
    const abi_ = [...(abi || []), solidityError, solidityPanic];
    const abiItem = abi_.find((x) => x.type === 'error' && signature === getFunctionSelector(formatAbiItem(x)));
    if (!abiItem)
        throw new AbiErrorSignatureNotFoundError(signature, {
            docsPath: '/docs/contract/decodeErrorResult',
        });
    return {
        abiItem,
        args: ('inputs' in abiItem && abiItem.inputs && abiItem.inputs.length > 0
            ? decodeAbiParameters(abiItem.inputs, slice(data, 4))
            : undefined),
        errorName: abiItem.name,
    };
}
//# sourceMappingURL=decodeErrorResult.js.map