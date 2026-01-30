/**
 * @module @tevm/node-effect/types
 * @description Type definitions for the node-effect package
 */

/**
 * Address type for Ethereum addresses.
 * @typedef {`0x${string}`} Address
 */

/**
 * Hex type for hex-encoded strings.
 * @typedef {`0x${string}`} Hex
 */

/**
 * ImpersonationShape interface for Effect-based impersonation state management.
 *
 * This interface provides Effect-wrapped methods for managing account impersonation
 * state in a Tevm node. Impersonation allows transactions to be sent as if they
 * were signed by any address.
 *
 * @typedef {Object} ImpersonationShape
 * @property {import('effect').Effect.Effect<Address | undefined>} getImpersonatedAccount - Get the currently impersonated account
 * @property {(address: Address | undefined) => import('effect').Effect.Effect<void>} setImpersonatedAccount - Set the impersonated account
 * @property {import('effect').Effect.Effect<boolean>} getAutoImpersonate - Get whether auto-impersonation is enabled
 * @property {(enabled: boolean) => import('effect').Effect.Effect<void>} setAutoImpersonate - Set auto-impersonation mode
 * @property {() => import('effect').Effect.Effect<ImpersonationShape>} deepCopy - Create a deep copy of the impersonation state
 */

/**
 * Configuration options for ImpersonationLive layer.
 * @typedef {Object} ImpersonationLiveOptions
 * @property {Address} [initialAccount] - Initial account to impersonate
 * @property {boolean} [autoImpersonate] - Enable auto-impersonation by default
 */

/**
 * BlockParamsShape interface for Effect-based block parameter management.
 *
 * This interface provides Effect-wrapped methods for managing block parameters
 * that override defaults for the next block to be mined.
 *
 * @typedef {Object} BlockParamsShape
 * @property {import('effect').Effect.Effect<bigint | undefined>} getNextBlockTimestamp - Get the next block timestamp override
 * @property {(ts: bigint | undefined) => import('effect').Effect.Effect<void>} setNextBlockTimestamp - Set the next block timestamp override
 * @property {import('effect').Effect.Effect<bigint | undefined>} getNextBlockGasLimit - Get the next block gas limit override
 * @property {(gl: bigint | undefined) => import('effect').Effect.Effect<void>} setNextBlockGasLimit - Set the next block gas limit override
 * @property {import('effect').Effect.Effect<bigint | undefined>} getNextBlockBaseFeePerGas - Get the next block base fee per gas override
 * @property {(bf: bigint | undefined) => import('effect').Effect.Effect<void>} setNextBlockBaseFeePerGas - Set the next block base fee per gas override
 * @property {import('effect').Effect.Effect<bigint | undefined>} getMinGasPrice - Get the minimum gas price
 * @property {(price: bigint | undefined) => import('effect').Effect.Effect<void>} setMinGasPrice - Set the minimum gas price
 * @property {import('effect').Effect.Effect<bigint | undefined>} getBlockTimestampInterval - Get the block timestamp interval
 * @property {(interval: bigint | undefined) => import('effect').Effect.Effect<void>} setBlockTimestampInterval - Set the block timestamp interval
 * @property {import('effect').Effect.Effect<void>} clearNextBlockOverrides - Clear all next block overrides (called after mining)
 * @property {() => import('effect').Effect.Effect<BlockParamsShape>} deepCopy - Create a deep copy of the block params state
 */

/**
 * Configuration options for BlockParamsLive layer.
 * @typedef {Object} BlockParamsLiveOptions
 * @property {bigint} [nextBlockTimestamp] - Initial next block timestamp override
 * @property {bigint} [nextBlockGasLimit] - Initial next block gas limit override
 * @property {bigint} [nextBlockBaseFeePerGas] - Initial next block base fee per gas override
 * @property {bigint} [minGasPrice] - Initial minimum gas price
 * @property {bigint} [blockTimestampInterval] - Initial block timestamp interval
 */

/**
 * Snapshot data stored for a snapshot ID.
 * @typedef {Object} Snapshot
 * @property {Hex} stateRoot - The state root at snapshot time
 * @property {import('@tevm/state').TevmState} state - The full state dump at snapshot time
 */

/**
 * SnapshotShape interface for Effect-based snapshot management.
 *
 * This interface provides Effect-wrapped methods for managing EVM state snapshots.
 * Snapshots allow reverting to a previous state, useful for testing and simulation.
 *
 * @typedef {Object} SnapshotShape
 * @property {() => import('effect').Effect.Effect<Hex, never, import('@tevm/state-effect').StateManagerService>} takeSnapshot - Take a snapshot and return its ID
 * @property {(id: Hex) => import('effect').Effect.Effect<void, import('@tevm/errors-effect').SnapshotNotFoundError, import('@tevm/state-effect').StateManagerService>} revertToSnapshot - Revert to a snapshot by ID
 * @property {(id: Hex) => import('effect').Effect.Effect<Snapshot | undefined>} getSnapshot - Get a snapshot by ID
 * @property {import('effect').Effect.Effect<Map<Hex, Snapshot>>} getAllSnapshots - Get all snapshots
 * @property {() => import('effect').Effect.Effect<SnapshotShape>} deepCopy - Create a deep copy of the snapshot state
 */

export {}
