import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createLogger } from './logger.js'

type TestAny = any

describe(createLogger.name, () => {
	let pluginCreateInfo: TestAny

	beforeEach(() => {
		pluginCreateInfo = {
			project: {
				projectService: {
					logger: {
						info: vi.fn(),
					},
				},
			},
		}
	})

	it('should return a logger', () => {
		const logger = createLogger(pluginCreateInfo)

		expect(logger).toMatchInlineSnapshot(`
			{
			  "error": [Function],
			  "info": [Function],
			  "log": [Function],
			  "warn": [Function],
			}
		`)

		const info = 'info'
		const warn = 'warn'
		const error = 'error'
		const log = 'log'

		logger.info(info)
		logger.error(error)
		logger.warn(warn)
		logger.log(log)

		expect(pluginCreateInfo.project.projectService.logger.info).toHaveBeenCalledWith(`[tevm-ts-plugin] ${info}`)
		expect(pluginCreateInfo.project.projectService.logger.info).toHaveBeenCalledWith(`[tevm-ts-plugin] error: ${error}`)
		expect(pluginCreateInfo.project.projectService.logger.info).toHaveBeenCalledWith(
			`[tevm-ts-plugin] warning: ${warn}`,
		)
		expect(pluginCreateInfo.project.projectService.logger.info).toHaveBeenCalledWith(`[tevm-ts-plugin] log: ${log}`)
	})

	it('should handle complex objects by stringifying them', () => {
		const logger = createLogger(pluginCreateInfo)

		const complexObject = {
			nested: {
				value: 42,
				array: [1, 2, 3],
			},
			enabled: true,
		}

		logger.info(JSON.stringify(complexObject))
		logger.warn(JSON.stringify(complexObject))

		expect(pluginCreateInfo.project.projectService.logger.info).toHaveBeenCalledWith(
			`[tevm-ts-plugin] ${JSON.stringify(complexObject)}`,
		)
		expect(pluginCreateInfo.project.projectService.logger.info).toHaveBeenCalledWith(
			`[tevm-ts-plugin] warning: ${JSON.stringify(complexObject)}`,
		)
	})

	it('should handle errors when calling logger methods', () => {
		// The createLogger function itself doesn't do null checks, but we can mock a scenario
		// where the logger API exists but calling methods throws
		const mockedPluginInfo = {
			project: {
				projectService: {
					logger: {
						info: vi.fn().mockImplementation(() => {
							// First call works, second call throws
							if (mockedPluginInfo.project.projectService.logger.info.mock.calls.length > 1) {
								throw new Error('Logger error')
							}
						}),
					},
				},
			},
		}

		const logger = createLogger(mockedPluginInfo as any)

		// First call should work
		logger.info('This should work')
		expect(mockedPluginInfo.project.projectService.logger.info).toHaveBeenCalledTimes(1)

		// If logger implementation throws, our wrapper should pass that through
		expect(() => logger.info('This should throw')).toThrow('Logger error')
	})
})
