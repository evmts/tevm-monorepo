import { z } from 'zod'

/**
 * Zod schema for EVM execution event handlers
 * These are not part of the JSON-RPC interface but are used internally for call handling
 */
export const zCallEvents = z
	.object({
		onStep: z.function().optional().describe('Handler called on each EVM step (instruction execution)'),
		onNewContract: z.function().optional().describe('Handler called when a new contract is created'),
		onBeforeMessage: z.function().optional().describe('Handler called before a message (call) is processed'),
		onAfterMessage: z.function().optional().describe('Handler called after a message (call) is processed'),
	})
	.partial()
