export class ContractDoesNotExistError extends Error {
    /**
     * @param {string} contractAddress
     */
    constructor(contractAddress: string);
    /**
     * @type {'ContractDoesNotExistError'}
     * @override
     */
    override name: 'ContractDoesNotExistError';
    /**
     * @type {'ContractDoesNotExistError'}
     */
    _tag: 'ContractDoesNotExistError';
}
/**
 * @type {import("./RunContractCallHandlerGeneric.js").RunContractCallHandlerGeneric}
 */
export const runContractCallHandler: import("./RunContractCallHandlerGeneric.js").RunContractCallHandlerGeneric;
//# sourceMappingURL=runContractCallHandler.d.ts.map