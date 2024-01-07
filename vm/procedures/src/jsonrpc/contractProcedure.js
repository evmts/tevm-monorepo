import { callProcedure } from '../index.js'

/**
 * Creates a Contract JSON-RPC Procedure for handling contract requests with Ethereumjs EVM
 * Because the Contract handler is a quality of life wrapper around a call for the JSON rpc interface
 * we simply overload call instead of creating a seperate tevm_contract method
 */
export const contractProcedure = callProcedure
