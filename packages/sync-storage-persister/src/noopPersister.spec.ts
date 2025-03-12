import { describe, expect, it } from 'vitest'
import { noopPersister } from './noopPersister.js'

describe('noopPersister', () => {
	it('should have the expected interface', () => {
		expect(noopPersister).toHaveProperty('persistTevmState')
		expect(noopPersister).toHaveProperty('restoreState')
		expect(noopPersister).toHaveProperty('removePersistedState')
	})

	it('should return undefined on restoreState', () => {
		expect(noopPersister.restoreState()).toBeUndefined()
	})

	it('should return undefined on persistTevmState', () => {
		expect(noopPersister.persistTevmState(undefined)).toBeUndefined()
	})

	it('should return undefined on removePersistedState', () => {
		expect(noopPersister.removePersistedState()).toBeUndefined()
	})
})
