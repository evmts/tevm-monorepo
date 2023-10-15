import { formatAbiItem } from '../abi/formatAbiItem.js';
import { extractFunctionName, extractFunctionParams, } from '../contract/extractFunctionParts.js';
import { toBytes } from '../encoding/toBytes.js';
import { keccak256 } from './keccak256.js';
const hash = (value) => keccak256(toBytes(value));
export function hashFunction(def) {
    const name = extractFunctionName(def);
    const params = extractFunctionParams(def) || [];
    return hash(`${name}(${params.map(({ type }) => type).join(',')})`);
}
export function hashAbiItem(abiItem) {
    return hash(formatAbiItem(abiItem));
}
//# sourceMappingURL=hashFunction.js.map