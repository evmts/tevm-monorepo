import { AbiFunctionNotFoundError, AbiFunctionOutputsNotFoundError, } from '../../errors/abi.js';
import { decodeAbiParameters } from './decodeAbiParameters.js';
import { getAbiItem } from './getAbiItem.js';
const docsPath = '/docs/contract/decodeFunctionResult';
export function decodeFunctionResult({ abi, args, functionName, data, }) {
    let abiItem = abi[0];
    if (functionName) {
        abiItem = getAbiItem({
            abi,
            args,
            name: functionName,
        });
        if (!abiItem)
            throw new AbiFunctionNotFoundError(functionName, { docsPath });
    }
    if (abiItem.type !== 'function')
        throw new AbiFunctionNotFoundError(undefined, { docsPath });
    if (!abiItem.outputs)
        throw new AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath });
    const values = decodeAbiParameters(abiItem.outputs, data);
    if (values && values.length > 1)
        return values;
    if (values && values.length === 1)
        return values[0];
    return undefined;
}
//# sourceMappingURL=decodeFunctionResult.js.map