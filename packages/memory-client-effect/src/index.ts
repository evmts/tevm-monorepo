/**
 * @module @tevm/memory-client-effect
 * TypeScript type exports for the Effect-based memory client
 */

// Re-export all JavaScript exports with types
export { MemoryClientService } from './MemoryClientService.js'
export { MemoryClientLive } from './MemoryClientLive.js'
export { createMemoryClient } from './createMemoryClient.js'

// Type exports
export type {
	Hex,
	Address,
	BlockParam,
	MemoryClientOptions,
	MemoryClientShape,
	MemoryClientLiveOptions,
} from './types.js'

// Re-export from createMemoryClient
export type { ViemMemoryClient } from './createMemoryClient.js'
