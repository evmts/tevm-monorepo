import { keccak256, numberToHex, toHex } from 'viem'
import { dumpCanonicalGenesis } from './dumpCannonicalGenesis.js'

/**
 * Commits the current change-set to the instance since the
 * last call to checkpoint.
 * @type {import("../state-types/index.js").StateAction<'commit'>}
 */
export const commit =
	(baseState) =>
	async (createNewStateRoot = false) => {
		const state = await dumpCanonicalGenesis(baseState)()
		// This is kinda hacky we are just ranodmly generating new state roots
		// since we don't use a trie we are kinda hacking this
		// This might be needlessy slow as state gets big but for now it feels the most rubust wrt correctness

		const newStateRoot = (() => {
			if (!createNewStateRoot) {
				baseState.logger.debug('Comitting to existing state root...')
				return baseState.getCurrentStateRoot()
			}
			/**
			 * @type {import('../state-types/ParameterizedTevmState.js').ParameterizedTevmState}
			 */
			const jsonSerializableState = {}

			for (const [k, v] of Object.entries(state)) {
				const { nonce, balance, storageRoot, codeHash, deployedBytecode } = v
				jsonSerializableState[k] = {
					...v,
					nonce: numberToHex(nonce),
					balance: numberToHex(balance),
					storageRoot: storageRoot,
					codeHash: codeHash,
					...(deployedBytecode !== undefined ? { deployedBytecode } : {}),
				}
			}
			const root = keccak256(toHex(JSON.stringify(jsonSerializableState)))
			baseState.logger.debug({ root }, 'Committing to new state root...')
			return root
		})()

		baseState.stateRoots.set(newStateRoot, state)
		baseState.logger.debug({ stateRoot: newStateRoot }, 'Saving state roots...')
		baseState.setCurrentStateRoot(newStateRoot)

		baseState.caches.accounts.commit()
		baseState.caches.contracts.commit()
		baseState.caches.storage.commit()

		baseState.logger.debug('State roots are comitted successfully')

		baseState.options.onCommit?.(baseState)

		return
	}
