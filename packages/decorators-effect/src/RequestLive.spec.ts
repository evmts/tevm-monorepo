import { describe, it, expect, vi } from 'vitest'
import { Effect, Layer } from 'effect'
import { RequestService } from './RequestService.js'
import { RequestLive } from './RequestLive.js'
import { EthActionsService } from './EthActionsService.js'
import { TevmActionsService } from './TevmActionsService.js'

describe('RequestLive', () => {
	const createMockEthActions = () => ({
		blockNumber: vi.fn(() => Effect.succeed(100n)),
		call: vi.fn(() => Effect.succeed('0x' as const)),
		chainId: vi.fn(() => Effect.succeed(1n)),
		gasPrice: vi.fn(() => Effect.succeed(1000000000n)),
		getBalance: vi.fn(() => Effect.succeed(1000000000000000000n)),
		getCode: vi.fn(() => Effect.succeed('0x' as const)),
		getStorageAt: vi.fn(() =>
			Effect.succeed(
				'0x0000000000000000000000000000000000000000000000000000000000000000' as const
			)
		),
	})

	const createMockTevmActions = () => ({
		call: vi.fn(() =>
			Effect.succeed({
				rawData: '0x' as const,
				executionGasUsed: 21000n,
			})
		),
		getAccount: vi.fn((params: any) =>
			Effect.succeed({
				address: params.address,
				nonce: 0n,
				balance: 1000000000000000000n,
				deployedBytecode: '0x' as const,
				storageRoot:
					'0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421' as const,
				codeHash:
					'0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' as const,
				isContract: false,
				isEmpty: false,
			})
		),
		setAccount: vi.fn((params: any) =>
			Effect.succeed({ address: params.address })
		),
		dumpState: vi.fn(() => Effect.succeed('0x' as const)),
		loadState: vi.fn(() => Effect.succeed(undefined)),
		mine: vi.fn(() => Effect.succeed(undefined)),
	})

	const createTestLayer = () => {
		const ethActionsMock = createMockEthActions()
		const tevmActionsMock = createMockTevmActions()

		const mockLayer = Layer.mergeAll(
			Layer.succeed(EthActionsService, ethActionsMock as any),
			Layer.succeed(TevmActionsService, tevmActionsMock as any)
		)

		return {
			layer: Layer.provide(RequestLive, mockLayer),
			mocks: {
				ethActions: ethActionsMock,
				tevmActions: tevmActionsMock,
			},
		}
	}

	it('should handle eth_blockNumber request', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'eth_blockNumber',
				params: [],
			})
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe('0x64') // 100 in hex
		expect(mocks.ethActions.blockNumber).toHaveBeenCalled()
	})

	it('should handle eth_chainId request', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'eth_chainId',
				params: [],
			})
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe('0x1')
		expect(mocks.ethActions.chainId).toHaveBeenCalled()
	})

	it('should handle eth_getBalance request', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'eth_getBalance',
				params: ['0x1234567890123456789012345678901234567890', 'latest'],
			})
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe('0xde0b6b3a7640000') // 1e18 in hex
		expect(mocks.ethActions.getBalance).toHaveBeenCalled()
	})

	it('should handle tevm_getAccount request', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'tevm_getAccount',
				params: [{ address: '0x1234567890123456789012345678901234567890' }],
			})
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect((result as any).balance).toBe(1000000000000000000n)
		expect(mocks.tevmActions.getAccount).toHaveBeenCalled()
	})

	it('should handle tevm_setAccount request', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'tevm_setAccount',
				params: [
					{
						address: '0x1234567890123456789012345678901234567890',
						balance: 5000000000000000000n,
					},
				],
			})
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect((result as any).address).toBe(
			'0x1234567890123456789012345678901234567890'
		)
		expect(mocks.tevmActions.setAccount).toHaveBeenCalled()
	})

	it('should handle evm_mine request', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'evm_mine',
				params: ['0x3'], // 3 blocks
			})
		})

		await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(mocks.tevmActions.mine).toHaveBeenCalledWith({ blocks: 3 })
	})

	it('should fail on unsupported method', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'unsupported_method',
				params: [],
			})
		})

		await expect(
			Effect.runPromise(program.pipe(Effect.provide(layer)))
		).rejects.toThrow('Unsupported method')
	})

	it('should handle eth_gasPrice request', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'eth_gasPrice',
				params: [],
			})
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe('0x3b9aca00') // 1 gwei in hex
		expect(mocks.ethActions.gasPrice).toHaveBeenCalled()
	})

	it('should handle eth_call request', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'eth_call',
				params: [{ to: '0x1234567890123456789012345678901234567890', data: '0x1234' }],
			})
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe('0x')
		expect(mocks.ethActions.call).toHaveBeenCalled()
	})

	it('should fail eth_call with missing params', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'eth_call',
				params: [],
			})
		})

		await expect(
			Effect.runPromise(program.pipe(Effect.provide(layer)))
		).rejects.toThrow('Missing call parameters')
	})

	it('should fail eth_getBalance with missing address', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'eth_getBalance',
				params: [],
			})
		})

		await expect(
			Effect.runPromise(program.pipe(Effect.provide(layer)))
		).rejects.toThrow('Missing address parameter')
	})

	it('should handle eth_getBalance without blockTag', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'eth_getBalance',
				params: ['0x1234567890123456789012345678901234567890'],
			})
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe('0xde0b6b3a7640000')
		expect(mocks.ethActions.getBalance).toHaveBeenCalled()
	})

	it('should handle eth_getCode request', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'eth_getCode',
				params: ['0x1234567890123456789012345678901234567890', 'latest'],
			})
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe('0x')
		expect(mocks.ethActions.getCode).toHaveBeenCalled()
	})

	it('should fail eth_getCode with missing address', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'eth_getCode',
				params: [],
			})
		})

		await expect(
			Effect.runPromise(program.pipe(Effect.provide(layer)))
		).rejects.toThrow('Missing address parameter')
	})

	it('should handle eth_getStorageAt request', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'eth_getStorageAt',
				params: ['0x1234567890123456789012345678901234567890', '0x0', 'latest'],
			})
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe('0x0000000000000000000000000000000000000000000000000000000000000000')
		expect(mocks.ethActions.getStorageAt).toHaveBeenCalled()
	})

	it('should fail eth_getStorageAt with missing address', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'eth_getStorageAt',
				params: [],
			})
		})

		await expect(
			Effect.runPromise(program.pipe(Effect.provide(layer)))
		).rejects.toThrow('Missing address or position parameter')
	})

	it('should fail tevm_getAccount with missing address', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'tevm_getAccount',
				params: [{}],
			})
		})

		await expect(
			Effect.runPromise(program.pipe(Effect.provide(layer)))
		).rejects.toThrow('Missing address parameter')
	})

	it('should fail tevm_setAccount with missing address', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'tevm_setAccount',
				params: [{}],
			})
		})

		await expect(
			Effect.runPromise(program.pipe(Effect.provide(layer)))
		).rejects.toThrow('Missing address parameter')
	})

	it('should handle tevm_call request', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'tevm_call',
				params: [{ to: '0x1234567890123456789012345678901234567890' }],
			})
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect((result as any).rawData).toBe('0x')
		expect(mocks.tevmActions.call).toHaveBeenCalled()
	})

	it('should handle tevm_call with no params', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'tevm_call',
				params: [],
			})
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect((result as any).rawData).toBe('0x')
		expect(mocks.tevmActions.call).toHaveBeenCalledWith({})
	})

	it('should handle tevm_dumpState request', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'tevm_dumpState',
				params: [],
			})
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe('0x')
		expect(mocks.tevmActions.dumpState).toHaveBeenCalled()
	})

	it('should handle tevm_loadState request', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'tevm_loadState',
				params: ['0x1234'],
			})
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result).toBe(null)
		expect(mocks.tevmActions.loadState).toHaveBeenCalledWith('0x1234')
	})

	it('should fail tevm_loadState with missing state', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'tevm_loadState',
				params: [],
			})
		})

		await expect(
			Effect.runPromise(program.pipe(Effect.provide(layer)))
		).rejects.toThrow('Missing state parameter')
	})

	it('should handle anvil_mine request', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'anvil_mine',
				params: ['0x5'], // 5 blocks
			})
		})

		await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(mocks.tevmActions.mine).toHaveBeenCalledWith({ blocks: 5 })
	})

	it('should handle evm_mine with no params (default 1 block)', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			return yield* requestService.request({
				method: 'evm_mine',
				params: [],
			})
		})

		await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(mocks.tevmActions.mine).toHaveBeenCalledWith({ blocks: 1 })
	})
})
