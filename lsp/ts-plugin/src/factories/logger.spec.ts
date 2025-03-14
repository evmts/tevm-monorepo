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
})
