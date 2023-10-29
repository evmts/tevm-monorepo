import { beforeEach, describe, expect, it } from 'vitest'

import { BaseState } from './BaseState.js'

class State extends BaseState<State> {
	str = 'a'
	bool = true
	num = 420

	toggleBool = () => {
		this.set((state) => ({
			bool: !state.bool,
		}))
	}

	incNum = () => {
		this.set((state) => ({
			num: state.num + 1,
		}))
	}

	setStr = (str: string) => {
		this.set({ str })
	}

	getStuff = () => {
		return this.get()
	}
}

let store: ReturnType<typeof State.prototype.createStore>

beforeEach(() => {
	store = new State().createStore()
})

describe(BaseState.name, () => {
	it('should work', () => {
		const originalState = store.getState()
		expect(originalState.getStuff()).toEqual({
			...originalState,
			str: 'a',
			bool: true,
			num: 420,
		})
		store.getState().toggleBool()
		expect(store.getState().getStuff()).toEqual({
			...originalState,
			str: 'a',
			bool: false,
			num: 420,
		})
		store.getState().setStr('newstr')
		expect(store.getState().getStuff()).toEqual({
			...originalState,
			str: 'newstr',
			bool: false,
			num: 420,
		})
		store.getState().incNum()
		expect(store.getState().getStuff()).toEqual({
			...originalState,
			str: 'newstr',
			bool: false,
			num: 421,
		})
	})

	it('should still work with enable dev', () => {
		store = new State().createStore(true)
		const originalState = store.getState()
		expect(originalState.getStuff()).toEqual({
			...originalState,
			str: 'a',
			bool: true,
			num: 420,
		})
		store.getState().toggleBool()
		expect(store.getState().getStuff()).toEqual({
			...originalState,
			str: 'a',
			bool: false,
			num: 420,
		})
		store.getState().setStr('newstr')
		expect(store.getState().getStuff()).toEqual({
			...originalState,
			str: 'newstr',
			bool: false,
			num: 420,
		})
		store.getState().incNum()
		expect(store.getState().getStuff()).toEqual({
			...originalState,
			str: 'newstr',
			bool: false,
			num: 421,
		})
	})

	it('should throw if user tries to access anything other than get or set', () => {
		class State extends BaseState<State> {
			prop = 'prop'
			setProp = () => {
				return this.set({ prop: this.prop + this.prop })
			}
		}
		const store = new State().createStore()
		expect(() => store.getState().setProp()).toThrowError(
			'Access state with this.get().prop rather than this.prop',
		)
	})
})
