import { createLogger } from './logger.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

		logger.info(info)
		logger.error(error)
		logger.warn(warn)

		expect(
			pluginCreateInfo.project.projectService.logger.info,
		).toHaveBeenCalledWith(`[evmts-ts-plugin] ${info}`)
		expect(
			pluginCreateInfo.project.projectService.logger.info,
		).toHaveBeenCalledWith(`[evmts-ts-plugin] error: ${error}`)
		expect(
			pluginCreateInfo.project.projectService.logger.info,
		).toHaveBeenCalledWith(`[evmts-ts-plugin] warning: ${warn}`)
	})
})
