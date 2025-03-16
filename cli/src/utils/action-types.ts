/**
 * Common types and interfaces for actions
 */

/**
 * Base parameters that can be passed to most Tevm actions
 */
export interface BaseActionParams {
  to?: string
  from?: string
  data?: string
  value?: bigint
  nonce?: number
  gas?: bigint
  gasPrice?: bigint
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  blockTag?: string
  blockNumber?: number
}

/**
 * Parameters specific to call actions
 */
export interface CallParams extends BaseActionParams {
  accessList?: any[]
  code?: string
  deployedBytecode?: string
  salt?: string
  gasRefund?: bigint
  caller?: string
  origin?: string
  depth?: number
  skipBalance?: boolean
  createTrace?: boolean
  createAccessList?: boolean
  createTransaction?: 'on-success' | 'always' | 'never'
}

/**
 * Basic result interface for call actions
 */
export interface CallResult {
  data: string
  [key: string]: any
}

/**
 * Parameters specific to read contract actions
 */
export interface ReadContractParams extends BaseActionParams {
  address: string
  abi: any
  functionName: string
  args?: any[]
}

/**
 * Parameters for account operations
 */
export interface AccountParams {
  address: string
  balance?: bigint
  nonce?: number
  code?: string
  storage?: Record<string, string>
}

/**
 * Common option descriptions
 */
export const commonOptionDescriptions = {
  to: 'Contract address to call (env: TEVM_TO)',
  rpc: 'RPC endpoint (env: TEVM_RPC)',
  data: 'Transaction data (hex encoded) (env: TEVM_DATA)',
  from: 'Address to send the transaction from (env: TEVM_FROM)',
  value: 'ETH value to send in wei (env: TEVM_VALUE)',
  code: 'The encoded code to deploy (with constructor args) (env: TEVM_CODE)',
  deployedBytecode: 'Deployed bytecode to put in state before call (env: TEVM_DEPLOYED_BYTECODE)',
  salt: 'CREATE2 salt (hex encoded) (env: TEVM_SALT)',
  gas: 'Gas limit for the transaction (env: TEVM_GAS)',
  gasPrice: 'Gas price in wei (env: TEVM_GAS_PRICE)',
  maxFeePerGas: 'Maximum fee per gas (EIP-1559) (env: TEVM_MAX_FEE_PER_GAS)',
  maxPriorityFeePerGas: 'Maximum priority fee per gas (EIP-1559) (env: TEVM_MAX_PRIORITY_FEE_PER_GAS)',
  gasRefund: 'Gas refund counter (env: TEVM_GAS_REFUND)',
  blockTag: 'Block tag (latest, pending, etc.) or number (env: TEVM_BLOCK_TAG)',
  address: 'Account or contract address (env: TEVM_ADDRESS)',
  abi: 'Contract ABI as JSON string or file path (env: TEVM_ABI)',
  functionName: 'Function name to call on the contract (env: TEVM_FUNCTION_NAME)',
  args: 'Function arguments as JSON array (env: TEVM_ARGS)',
  trace: 'Return a complete trace with the call (env: TEVM_TRACE)',
}

/**
 * Default values for common action parameters
 */
export const defaultActionValues: Record<string, any> = {
  to: '0x0000000000000000000000000000000000000000',
  from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  data: '0x',
  depth: 0,
  gas: BigInt(10000000),            // 10 million gas
  gasPrice: BigInt(1000000000),     // 1 gwei
  maxFeePerGas: BigInt(2000000000), // 2 gwei
  maxPriorityFeePerGas: BigInt(1000000000), // 1 gwei
  gasRefund: BigInt(0),
  createTrace: false,
  createAccessList: false,
  skipBalance: false,
  createTransaction: 'never',
  rpc: 'http://localhost:8545',
  value: BigInt(0),                 // 0 ETH
  blockTag: 'latest',               // Latest block
}