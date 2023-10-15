"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFunctionType = exports.extractFunctionParams = exports.extractFunctionName = exports.extractFunctionParts = void 0;
const paramsRegex = /((function|event)\s)?(.*)(\((.*)\))/;
function extractFunctionParts(def) {
    const parts = def.match(paramsRegex);
    const type = parts?.[2] || undefined;
    const name = parts?.[3];
    const params = parts?.[5] || undefined;
    return { type, name, params };
}
exports.extractFunctionParts = extractFunctionParts;
function extractFunctionName(def) {
    return extractFunctionParts(def).name;
}
exports.extractFunctionName = extractFunctionName;
function extractFunctionParams(def) {
    const params = extractFunctionParts(def).params;
    const splitParams = params?.split(',').map((x) => x.trim().split(' '));
    return splitParams?.map((param) => ({
        type: param[0],
        name: param[1] === 'indexed' ? param[2] : param[1],
        ...(param[1] === 'indexed' ? { indexed: true } : {}),
    }));
}
exports.extractFunctionParams = extractFunctionParams;
function extractFunctionType(def) {
    return extractFunctionParts(def).type;
}
exports.extractFunctionType = extractFunctionType;
//# sourceMappingURL=extractFunctionParts.js.map