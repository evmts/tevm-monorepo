import { DefaultStateManager } from '@ethereumjs/statemanager'
import { Account, Address } from '@ethereumjs/util'
import { TevmStateManagerInterface } from '../../types/stateManager/TevmStateManagerInterface'
import type { TevmState } from '../Tevm.js'

export class TevmStateManager
	extends DefaultStateManager
	implements TevmStateManagerInterface
{
	dumpState = async () => {
		const accountAddresses: string[] = []
		this._accountCache?._orderedMapCache?.forEach((e) => {
			console.log('e', e[0])
			accountAddresses.push(e[0])
		})

		const state: TevmState = {}

		for (const address of accountAddresses) {
			try {
				const hexAddress = `0x${address}`
				const account = await this.getAccount(Address.fromString(hexAddress))

				if (account !== undefined) {
					const storage = await this.dumpStorage(Address.fromString(hexAddress))

					state[hexAddress] = { ...account, storage }
				}
			} catch (error: any) {
				console.error(`Error fetching account for ${address}: ${error.message}`)
			}
		}

		return state
	}

	loadState = async (state: TevmState) => {
		for (const [k, v] of Object.entries(state)) {
			const { nonce, balance, storageRoot, codeHash, storage } = v
			const account = new Account(nonce, balance, storageRoot, codeHash)
			const address = Address.fromString(k)
			this._accountCache?.put(address, account)
			if (storage !== undefined) {
				for (const [storageKey, storageData] of Object.entries(storage)) {
					const key = Uint8Array.from(Buffer.from(storageKey, 'hex'))
					const data = Uint8Array.from(Buffer.from(storageData, 'hex'))
					this.putContractStorage(address, key, data)
				}
			}
		}
	}
}
