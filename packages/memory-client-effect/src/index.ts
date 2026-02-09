/**
 * @module @tevm/memory-client-effect
 * TypeScript type exports for the Effect-based memory client
 */

// Re-export from createMemoryClient
export type { ViemMemoryClient } from './createMemoryClient.js'
export { createMemoryClient } from './createMemoryClient.js'
export { MemoryClientLive } from './MemoryClientLive.js'
// Re-export all JavaScript exports with types
export { MemoryClientService } from './MemoryClientService.js'
// Type exports
export type {
	Address,
	BlockParam,
	Hex,
	MemoryClientLiveOptions,
	MemoryClientOptions,
	MemoryClientShape,
} from './types.js'
