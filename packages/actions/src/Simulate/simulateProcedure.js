/**
 * @module simulateProcedure
 */

import { bigIntToHex } from '@tevm/utils'
import { formatLog } from 'viem'
import { fromHex } from 'viem'
import { simulateHandler } from './simulateHandler.js'

/**
 * Formats a simulation call result for JSON-RPC 
 * @param {import('../../types/SimulateResult.js').SimulateCallResult} result - The call result to format
 * @returns {object} The formatted result
 */
const formatSimulateCallResult = (result) => {
  return {
    status: result.status,
    data: result.data,
    gasUsed: bigIntToHex(result.gasUsed),
    logs: result.logs.map((log) => ({
      ...log,
      // Convert any bigint fields to hex
      logIndex: log.logIndex !== undefined ? bigIntToHex(log.logIndex) : undefined,
      blockNumber: log.blockNumber !== undefined ? bigIntToHex(log.blockNumber) : undefined,
      transactionIndex: log.transactionIndex !== undefined 
        ? bigIntToHex(log.transactionIndex) 
        : undefined,
    })),
    // Don't include result as it might contain non-JSON-serializable values
    ...(result.error ? { error: result.error.message } : {}),
  }
}

/**
 * Formats an asset change for JSON-RPC
 * @param {import('../../types/SimulateResult.js').AssetChange} change - The asset change to format
 * @returns {object} The formatted asset change
 */
const formatAssetChange = (change) => {
  return {
    token: change.token,
    value: {
      diff: bigIntToHex(change.value.diff),
      ...(change.value.start !== undefined ? { start: bigIntToHex(change.value.start) } : {}),
      ...(change.value.end !== undefined ? { end: bigIntToHex(change.value.end) } : {}),
    },
  }
}

/**
 * Parses a simulation call item from JSON-RPC
 * @param {object} call - The call item to parse
 * @returns {import('../../types/SimulateCallItem.js').SimulateCallItem} The parsed call
 */
const parseSimulateCallItem = (call) => {
  return {
    ...(call.from !== undefined ? { from: call.from } : {}),
    ...(call.to !== undefined ? { to: call.to } : {}),
    ...(call.data !== undefined ? { data: call.data } : {}),
    ...(call.gas !== undefined ? { gas: fromHex(call.gas, 'bigint') } : {}),
    ...(call.gasPrice !== undefined ? { gasPrice: fromHex(call.gasPrice, 'bigint') } : {}),
    ...(call.maxFeePerGas !== undefined ? { maxFeePerGas: fromHex(call.maxFeePerGas, 'bigint') } : {}),
    ...(call.maxPriorityFeePerGas !== undefined 
      ? { maxPriorityFeePerGas: fromHex(call.maxPriorityFeePerGas, 'bigint') } 
      : {}),
    ...(call.value !== undefined ? { value: fromHex(call.value, 'bigint') } : {}),
    ...(call.nonce !== undefined ? { nonce: Number(fromHex(call.nonce, 'number')) } : {}),
    ...(call.accessList !== undefined ? { accessList: call.accessList } : {}),
  }
}

/**
 * Parses a state override from JSON-RPC
 * @param {object} override - The state override to parse
 * @returns {import('../../types/StateOverride.js').StateOverride} The parsed override
 */
const parseStateOverride = (override) => {
  return {
    address: override.address,
    ...(override.balance !== undefined ? { balance: fromHex(override.balance, 'bigint') } : {}),
    ...(override.nonce !== undefined ? { nonce: Number(fromHex(override.nonce, 'number')) } : {}),
    ...(override.code !== undefined ? { code: override.code } : {}),
    ...(override.storage !== undefined ? { storage: override.storage } : {}),
  }
}

/**
 * Parses a block override from JSON-RPC
 * @param {object} override - The block override to parse
 * @returns {import('../../types/BlockOverride.js').BlockOverride} The parsed override
 */
const parseBlockOverride = (override) => {
  return {
    ...(override.baseFeePerGas !== undefined 
      ? { baseFeePerGas: fromHex(override.baseFeePerGas, 'bigint') } 
      : {}),
    ...(override.timestamp !== undefined ? { timestamp: fromHex(override.timestamp, 'bigint') } : {}),
    ...(override.number !== undefined ? { number: fromHex(override.number, 'bigint') } : {}),
    ...(override.difficulty !== undefined ? { difficulty: fromHex(override.difficulty, 'bigint') } : {}),
    ...(override.gasLimit !== undefined ? { gasLimit: fromHex(override.gasLimit, 'bigint') } : {}),
    ...(override.coinbase !== undefined ? { coinbase: override.coinbase } : {}),
  }
}

/**
 * JSON-RPC procedure for the simulate method
 * @type {import('../jsonrpc.js').EthProcedure<'eth_simulateV1'>}
 */
export const simulateProcedure = (client) => {
  const handler = simulateHandler(client)
  
  return async (params) => {
    try {
      const request = params[0] || {}
      
      // Parse params from JSON-RPC format to internal format
      const simulateParams = {
        ...(request.account ? { account: request.account } : {}),
        calls: (request.blockStateCalls || []).map(parseSimulateCallItem),
        ...(request.blockNumber !== undefined ? { blockNumber: request.blockNumber } : {}),
        ...(request.stateOverrides?.length > 0 
          ? { stateOverrides: request.stateOverrides.map(parseStateOverride) } 
          : {}),
        ...(request.blockOverrides ? { blockOverrides: parseBlockOverride(request.blockOverrides) } : {}),
        ...(request.traceAssetChanges !== undefined ? { traceAssetChanges: request.traceAssetChanges } : {}),
      }
      
      // Execute the simulation
      const result = await handler(simulateParams)
      
      // Format result to JSON-RPC format
      return {
        results: result.results.map(formatSimulateCallResult),
        ...(result.assetChanges 
          ? { assetChanges: result.assetChanges.map(formatAssetChange) } 
          : {}),
      }
    } catch (error) {
      // Ensure error is JSON serializable
      throw new Error(error.message)
    }
  }
}