import { describe, expect, it } from 'vitest'
import * as IndexExports from './index.js'

describe('src/index.js', () => {
	it('exports resolveArtifacts', () => {
		expect(IndexExports.resolveArtifacts).toBeDefined()
	})

	it('exports resolveArtifactsSync', () => {
		expect(IndexExports.resolveArtifactsSync).toBeDefined()
	})
})
