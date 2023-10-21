import { describe, expect, it } from 'vitest'

import {
	FoundryConfigError,
	FoundryNotFoundError,
	loadFoundryConfig,
} from './loadFoundryConfig.js'
import { runSync } from 'effect/Effect'
import { join } from 'path'

const foundryFixture = join(__dirname, '..', 'fixtures', 'withFoundry')

describe(loadFoundryConfig.name, () => {
	it('should return an empty config if no foundryProject is passed in', () => {
		expect(runSync(loadFoundryConfig(undefined, foundryFixture))).toEqual({})
		expect(
			runSync(
				loadFoundryConfig(
					false,
					join(__dirname, '..', 'fixtures', 'withFoundry'),
				),
			),
		).toEqual({})
	})

	it(`should throw ${FoundryNotFoundError.name} if command is not found`, () => {
		expect(() =>
			runSync(loadFoundryConfig('notforgecommand', foundryFixture)),
		).toThrowError(new FoundryNotFoundError('notforgecommand'))
	})

	it.todo(
		`should throw ${FoundryConfigError.name} if foundry throws an error they can't parse`,
	)
})
