import fs from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

// Since TypeScript types don't exist at runtime, we'll check the file directly for type definitions

describe('solcTypes', () => {
	it('should contain all necessary type definitions', async () => {
		// Read the file content directly
		const filePath = path.resolve(__dirname, 'solcTypes.ts')
		const content = await fs.readFile(filePath, 'utf-8')

		// Check for type export statements
		const requiredTypes = [
			'SolcLanguage',
			'SolcInputSource',
			'SolcRemapping',
			'SolcYulDetails',
			'SolcOptimizerDetails',
			'SolcOptimizer',
			'SolcOutputSelection',
			'SolcModelChecker',
			'SolcDebugSettings',
			'SolcMetadataSettings',
			'SolcSettings',
			'SolcInputSources',
			'SolcInputDescription',
			'SolcOutput',
			'SolcErrorEntry',
			'SolcContractOutput',
			'SolcVersions',
			'Releases',
			'Solc',
		]

		// Verify each required type exists in the file
		requiredTypes.forEach((typeName) => {
			expect(content).toContain(`export type ${typeName}`)
		})
	})

	it('should define SolcLanguage as a union of specific string literals', async () => {
		const filePath = path.resolve(__dirname, 'solcTypes.ts')
		const content = await fs.readFile(filePath, 'utf-8')

		// Check for the SolcLanguage type definition with all expected values
		expect(content).toContain("export type SolcLanguage = 'Solidity' | 'Yul' | 'SolidityAST'")
	})

	it('should include a comprehensive list of Solidity versions', async () => {
		const filePath = path.resolve(__dirname, 'solcTypes.ts')
		const content = await fs.readFile(filePath, 'utf-8')

		// Find the SolcVersions type definition
		const versionsTypeRegex = /export\s+type\s+SolcVersions\s*=([^;]+)/s
		const match = content.match(versionsTypeRegex)
		expect(match).not.toBeNull()

		if (match) {
			const typeDef = match[1]

			// Check for recent Solidity versions
			const recentVersions = ['0.8.28', '0.8.27', '0.8.26', '0.8.25', '0.8.24']
			recentVersions.forEach((version) => {
				expect(typeDef).toContain(`'${version}'`)
			})

			// Check for legacy versions as well
			const legacyVersions = ['0.7.6', '0.6.12', '0.5.17', '0.4.26']
			legacyVersions.forEach((version) => {
				expect(typeDef).toContain(`'${version}'`)
			})

			// Make sure there are many versions defined (union of string literals)
			const versionCount = (typeDef?.match(/'\d+\.\d+\.\d+'/g) || []).length
			expect(versionCount).toBeGreaterThan(30)
		}
	})

	it('should define the Solc interface with the required methods', async () => {
		const filePath = path.resolve(__dirname, 'solcTypes.ts')
		const content = await fs.readFile(filePath, 'utf-8')

		// Check for the Solc interface definition with all expected methods
		expect(content).toContain('export interface Solc')
		expect(content).toContain('version: string')
		expect(content).toContain('semver: string')
		expect(content).toContain('license: string')
		expect(content).toContain('compile:')
		expect(content).toContain('loadRemoteVersion:')
	})
})
