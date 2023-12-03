import { Trpc } from './Trpc.js'
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { type Mock, describe, expect, it, vi } from 'vitest'

vi.mock('@trpc/server', () => ({
	initTRPC: {
		context: vi.fn().mockReturnValue({
			create: vi.fn(),
		}),
	},
}))

describe('Trpc', () => {
	it('creates a wrapper around trpc with links to documentation in comments', async () => {
		const mockContext = initTRPC.context as Mock
		const mockCreate = initTRPC.context().create as Mock
		mockCreate.mockImplementation(
			// @ts-ignore - importActual is type unknown
			(await vi.importActual('@trpc/server')).initTRPC.context().create,
		)
		const trpc = new Trpc()
		expect(trpc.router).toBeDefined()
		expect(trpc.mergeRouters).toBeDefined()
		expect(trpc.procedure).toBeDefined()
		expect(trpc.middleware).toBeDefined()

		expect(mockCreate).toBeCalledWith({ transformer: superjson })
		expect(mockContext).toBeCalledWith()
	})
})
