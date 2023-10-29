import { BaseState } from './BaseState.js'
/**
 * Class representing the EVMts state
 * @extends {BaseState<{count: number}>}
 */
export class AppState extends BaseState<AppState> {
	/**
	 * Hello world
	 */
	public readonly count: number = 0
	/**
	 * Hello world
	 */
	public readonly setCount = (count: number) => this.set({ count })
}
