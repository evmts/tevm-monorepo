/**
 * Utility functions for handling CLI options
 */
import { z } from 'zod'
import { option } from 'pastel'
import { envVar } from '../hooks/useAction.js'
import { commonOptionDescriptions } from './action-types.js'

/**
 * Creates common CLI options used by many commands
 */
export function createCommonOptions() {
  return {
    // Interactive mode flag
    run: z.boolean().default(false).describe(
      option({
        description: 'Run directly without interactive parameter editing (env: TEVM_RUN)',
        alias: 'r',
      })
    ),

    // Transport options
    rpc: z.string().default(envVar('rpc') || 'http://localhost:8545').describe(
      option({
        description: commonOptionDescriptions.rpc,
        defaultValueDescription: 'http://localhost:8545',
      })
    ),

    // Output formatting
    formatJson: z.boolean().default(envVar('format_json') !== 'false').describe(
      option({
        description: 'Format output as JSON (env: TEVM_FORMAT_JSON)',
        defaultValueDescription: 'true',
      })
    ),
  }
}

/**
 * Creates options for address-based commands
 */
export function createAddressOptions() {
  return {
    address: z.string().describe(
      option({
        description: commonOptionDescriptions.address,
      })
    ),

    ...createCommonOptions()
  }
}

/**
 * Creates contract options for contract-related commands
 */
export function createContractOptions() {
  return {
    address: z.string().describe(
      option({
        description: commonOptionDescriptions.address,
      })
    ),

    abi: z.string().describe(
      option({
        description: commonOptionDescriptions.abi,
      })
    ),

    ...createCommonOptions()
  }
}

/**
 * Creates call-specific options
 */
export function createCallOptions() {
  return {
    // Contract address
    to: z.string().default(envVar('to') || '0x0000000000000000000000000000000000000000').describe(
      option({
        description: commonOptionDescriptions.to,
        defaultValueDescription: '0x0000000000000000000000000000000000000000',
      })
    ),

    // Basic call parameters
    data: z.string().optional().describe(
      option({
        description: commonOptionDescriptions.data,
      })
    ),

    from: z.string().default(envVar('from') || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266').describe(
      option({
        description: commonOptionDescriptions.from,
        defaultValueDescription: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      })
    ),

    value: z.string().optional().describe(
      option({
        description: commonOptionDescriptions.value,
      })
    ),

    // Contract deployment options
    code: z.string().optional().describe(
      option({
        description: commonOptionDescriptions.code,
      })
    ),

    deployedBytecode: z.string().optional().describe(
      option({
        description: commonOptionDescriptions.deployedBytecode,
      })
    ),

    // Gas parameters
    gas: z.string().optional().describe(
      option({
        description: commonOptionDescriptions.gas,
      })
    ),

    gasPrice: z.string().optional().describe(
      option({
        description: commonOptionDescriptions.gasPrice,
      })
    ),

    // Block options
    blockTag: z.string().optional().describe(
      option({
        description: commonOptionDescriptions.blockTag,
      })
    ),

    ...createCommonOptions()
  }
}

/**
 * Creates options for contract read operations
 */
export function createReadContractOptions() {
  return {
    address: z.string().describe(
      option({
        description: commonOptionDescriptions.address,
      })
    ),

    abi: z.string().describe(
      option({
        description: commonOptionDescriptions.abi,
      })
    ),

    functionName: z.string().describe(
      option({
        description: commonOptionDescriptions.functionName,
      })
    ),

    args: z.string().optional().describe(
      option({
        description: commonOptionDescriptions.args,
      })
    ),

    ...createCommonOptions()
  }
}