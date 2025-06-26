import { describe, expect, it, beforeEach } from 'vitest'
import { mainnet } from '@tevm/common'
import { http } from 'viem'
import { configureTestClient, getGlobalTestConfig } from './global.js'
import type { TestSnapshotClientOptions } from './types.js'

describe('global configuration', () => {
	beforeEach(() => {
		// @ts-expect-error - 'null' is not assignable to parameter of type 'TestSnapshotClientOptions'
		configureTestClient(null)
	})

	describe('configureTestClient', () => {
		it('should set global config correctly', () => {
			const config: TestSnapshotClientOptions = {
				tevm: {
					fork: {
						transport: http('https://mainnet.optimism.io'),
						blockTag: 123456n
					},
					common: mainnet,
				},
				snapshot: {
					dir: '__test_snapshots__'
				}
			}

			configureTestClient(config)
			expect(getGlobalTestConfig()).toMatchObject(config)
		})

		it('should allow reconfiguration', () => {
			const config1: TestSnapshotClientOptions = {
				tevm: {
					fork: { transport: http('https://first.rpc.com') }
				}
			}

			const config2: TestSnapshotClientOptions = {
				tevm: {
					fork: { transport: http('https://second.rpc.com') },
					common: mainnet
				}
			}

			configureTestClient(config1)
			expect(getGlobalTestConfig()).toMatchObject(config1)

			configureTestClient(config2)
			expect(getGlobalTestConfig()).toMatchObject(config2)
		})
	})

	describe('getGlobalTestConfig', () => {
		it('should return configured options when set', () => {
			const config: TestSnapshotClientOptions = {
				tevm: {
					fork: {
						transport: http('https://mainnet.optimism.io'),
						blockTag: 999999n
					},
					common: mainnet,
				}
			}

			configureTestClient(config)
			expect(getGlobalTestConfig()).toEqual(config)
		})

		it('should throw helpful error when not configured', () => {
			expect(() => getGlobalTestConfig()).toThrow(
				'Test client not configured. Call configureTestClient() in your vitest setup file first.'
			)
		})
	})
})