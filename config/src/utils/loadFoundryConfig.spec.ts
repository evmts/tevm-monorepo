import {
	FoundryConfigError,
	FoundryNotFoundError,
	InvalidRemappingsError,
	loadFoundryConfig,
} from './loadFoundryConfig.js'
import { execSync } from 'child_process'
import { runSync } from 'effect/Effect'
import { join } from 'path'
import {
	type MockedFunction,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

vi.mock('child_process', async () => ({
	execSync: vi.fn(),
}))

const mockExecSync = execSync as MockedFunction<typeof execSync>
const foundryFixture = join(__dirname, '..', 'fixtures', 'withFoundry')

describe(loadFoundryConfig.name, () => {
	beforeEach(() => {
		mockExecSync.mockReset()
	})
	it('should return the remappings from foundry', async () => {
		const { execSync } = (await vi.importActual('child_process')) as any
		mockExecSync.mockImplementationOnce(execSync)
		expect(
			runSync(loadFoundryConfig('forge', foundryFixture)),
		).toMatchInlineSnapshot(`
			{
			  "libs": [
			    "lib",
			  ],
			  "remappings": {
			    "@solmate-utils/": "/Users/willcory/evmts-monorepo/config/src/fixtures/withFoundry/lib/solmate/src/utils/",
			  },
			}
		`)
		expect(mockExecSync).lastCalledWith('forge config --json', {
			cwd: foundryFixture,
		})
		mockExecSync.mockImplementationOnce(execSync)
		expect(
			runSync(
				loadFoundryConfig(
					true,
					join(__dirname, '..', 'fixtures', 'withFoundry'),
				),
			),
		).toMatchInlineSnapshot(`
			{
			  "libs": [
			    "lib",
			  ],
			  "remappings": {
			    "@solmate-utils/": "/Users/willcory/evmts-monorepo/config/src/fixtures/withFoundry/lib/solmate/src/utils/",
			  },
			}
		`)
		expect(mockExecSync).lastCalledWith('forge config --json', {
			cwd: foundryFixture,
		})
	})

	it('should return an empty config if no foundryProject is passed in', () => {
		mockExecSync.mockImplementationOnce(
			(vi.importActual('child_process') as any).execSync,
		)
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
		mockExecSync.mockImplementationOnce(
			(vi.importActual('child_process') as any).execSync,
		)
		expect(() =>
			runSync(loadFoundryConfig('notforgecommand', foundryFixture)),
		).toThrowError(new FoundryNotFoundError('notforgecommand'))
	})

	it(`should throw ${FoundryConfigError.name} in unlikely event foundry returns invalid json`, () => {
		mockExecSync.mockImplementationOnce(() => {
			return `
[profile.default]
not-a-json
				`
		})
		expect(() =>
			runSync(loadFoundryConfig('forge', foundryFixture)),
		).toThrowError(new FoundryConfigError('forge'))
	})

	it(`should throw ${InvalidRemappingsError.name} in unlikey event foundry returns remappings not formatted as expected`, () => {
		const remap = 'not-fromatted-as-expected'
		mockExecSync.mockImplementationOnce(() => {
			return JSON.stringify({
				remappings: [remap],
			})
		})
		expect(() =>
			runSync(loadFoundryConfig('forge', foundryFixture)),
		).toThrowError(new InvalidRemappingsError(remap))
	})
})
