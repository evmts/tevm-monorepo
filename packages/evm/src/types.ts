import type { EthjsAddress, EthjsAccount } from '@tevm/utils'
import type { StateManager } from '@tevm/state'
import type { Common } from '@tevm/common'

/**
 * Minimal block interface for EVM calls.
 * This is compatible with @tevm/block Block but avoids a circular dependency.
 */
export type EvmBlockContext = {
  /** Block header information */
  header: {
    /** Block number */
    number: bigint
    /** Parent block hash */
    parentHash: Uint8Array
    /** Block timestamp */
    timestamp: bigint
    /** Gas limit for the block */
    gasLimit: bigint
    /** Fee recipient (coinbase) */
    coinbase: EthjsAddress
    /** Block difficulty */
    difficulty: bigint
    /** Prev randao (post-merge) or mix hash (pre-merge) */
    prevRandao?: Uint8Array
    /** Base fee per gas (EIP-1559) */
    baseFeePerGas?: bigint
    /** Blob gas used (EIP-4844) */
    blobGasUsed?: bigint
    /** Excess blob gas (EIP-4844) */
    excessBlobGas?: bigint
  }
}

/**
 * Options for running an EVM call.
 * This type is compatible with the ethereumjs EVM runCall options.
 */
export type EvmRunCallOpts = {
  /** Block context for the call */
  block?: EvmBlockContext
  /** Gas price for the transaction */
  gasPrice?: bigint
  /** Address of the caller */
  caller?: EthjsAddress
  /** Gas limit for the call */
  gasLimit?: bigint
  /** Address of the target contract (undefined for contract creation) */
  to?: EthjsAddress
  /** Blob versioned hashes for EIP-4844 transactions */
  blobVersionedHashes?: string[]
  /** Value in wei to send with the call */
  value?: bigint
  /** Input data for the call */
  data?: Uint8Array
  /** Skip balance check for the caller */
  skipBalance?: boolean
  /** Transaction origin address */
  origin?: EthjsAddress
  /** CREATE2 salt value */
  salt?: Uint8Array
  /** Current call depth */
  depth?: number
  /** Set of addresses that have been selfdestructed */
  selfdestruct?: Set<string>
  /** Current gas refund counter */
  gasRefund?: bigint
}

/**
 * Log entry from EVM execution.
 */
export type EvmLog = [
  /** Address that generated the log */
  address: Uint8Array,
  /** Array of 32-byte log topics */
  topics: Uint8Array[],
  /** Log data */
  data: Uint8Array
]

/**
 * Error that occurred during EVM execution.
 */
export type EvmExceptionError = {
  /** Error type or code */
  error: string
  /** Human-readable error message */
  errorMessage?: string
}

/**
 * Result of EVM bytecode execution.
 */
export type ExecResult = {
  /** Return value from the call/create */
  returnValue: Uint8Array
  /** Gas used during execution */
  executionGasUsed: bigint
  /** Gas refund accumulated */
  gasRefund?: bigint
  /** Logs generated during execution */
  logs?: EvmLog[]
  /** Addresses of contracts created during execution */
  createdAddresses?: Set<string>
  /** Addresses that were selfdestructed */
  selfdestruct?: string[]
  /** Error that occurred during execution (if any) */
  exceptionError?: EvmExceptionError
}

/**
 * Result of an EVM call or contract creation.
 */
export type EvmResult = {
  /** Execution result with return value, gas usage, and logs */
  execResult: ExecResult
  /** Address of contract created by CREATE/CREATE2 opcodes (if applicable) */
  createdAddress?: EthjsAddress
}

/**
 * Input type for precompile calls.
 */
export type PrecompileInput = {
  /** Input data for the precompile */
  data: Uint8Array
  /** Gas limit available for the precompile */
  gasLimit: bigint
  /** Common object for chain configuration */
  common?: Common
  /** The EVM instance (typed loosely to avoid circular dependency) */
  _EVM?: { runCall: (opts: EvmRunCallOpts) => Promise<EvmResult> }
  /** Debug function (optional) */
  _debug?: (message: string) => void
}

/**
 * Opcode information for EVM step tracing.
 */
export type OpcodeInfo = {
  /** Opcode byte value (0x00 - 0xff) */
  code: number
  /** Opcode name (e.g., 'PUSH1', 'ADD', 'CALL') */
  name: string
  /** Base gas fee for this opcode */
  fee: number
  /** Dynamic gas fee (if applicable) */
  dynamicFee?: bigint
  /** Whether this opcode requires async execution */
  isAsync: boolean
}

/**
 * Represents a single step in the EVM interpreter.
 * Used for debugging and tracing EVM execution.
 */
export type InterpreterStep = {
  /** Gas remaining after this step */
  gasLeft: bigint
  /** Gas refund counter */
  gasRefund: bigint
  /** State manager interface */
  stateManager: StateManager
  /** EVM stack (256-bit values as bigints) */
  stack: bigint[]
  /** Program counter position in bytecode */
  pc: number
  /** Current call depth */
  depth: number
  /** Current opcode information */
  opcode: OpcodeInfo
  /** Account at current execution address */
  account: EthjsAccount
  /** Current execution address */
  address: EthjsAddress
  /** Memory contents */
  memory: Uint8Array
  /** Memory size in 32-byte words */
  memoryWordCount: bigint
  /** Code address (may differ from address for DELEGATECALL) */
  codeAddress: EthjsAddress
  /** EOF section index (if executing EOF code) */
  eofSection?: number
  /** Immediate bytes following the opcode (for EOF) */
  immediate?: Uint8Array
  /** EOF function depth */
  eofFunctionDepth?: number
  /** Error bytes (if any) */
  error?: Uint8Array
  /** Storage slot changes: [key, value] pairs */
  storage?: [`0x${string}`, `0x${string}`][]
}

