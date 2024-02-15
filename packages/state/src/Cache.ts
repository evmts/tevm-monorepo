// [mozilla public license 2.0](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/LICENSE)
import type { EthjsAddress } from '@tevm/utils'
import { toHex } from 'viem'

export type GetContractStorage = (
	address: EthjsAddress,
	key: Uint8Array,
) => Promise<Uint8Array>

const toUnprefixedHex = (...params: Parameters<typeof toHex>) => {
	return toHex(...params).slice(2)
}

export class Cache {
	private map: Map<string, Map<string, Uint8Array>>
	private getContractStorage: GetContractStorage
	constructor(getContractStorage: GetContractStorage) {
		this.map = new Map()
		this.getContractStorage = getContractStorage
	}

	async get(address: EthjsAddress, key: Uint8Array): Promise<Uint8Array> {
		const cachedValue = this.map
			.get(toUnprefixedHex(address.bytes))
			?.get(toUnprefixedHex(key))
		if (cachedValue !== undefined) {
			return cachedValue
		}
		const value = await this.getContractStorage(address, key)
		this.put(address, key, value)
		return value
	}

	put(address: EthjsAddress, key: Uint8Array, value: Uint8Array) {
		const addressHex = toUnprefixedHex(address.bytes)
		let map = this.map.get(addressHex)
		if (map === undefined) {
			map = new Map()
			this.map.set(addressHex, map)
		}
		const keyHex = toUnprefixedHex(key)
		if (map?.has(keyHex) === false) {
			map?.set(keyHex, value)
		}
	}

	clear(): void {
		this.map = new Map()
	}
}
