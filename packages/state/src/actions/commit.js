import { keccak256, numberToHex, toHex } from 'viem'
import { dumpCanonicalGenesis } from './dumpCannonicalGenesis.js'

// TODO we might want to sometimes prune state roots

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
			return keccak256(toHex(JSON.stringify(jsonSerializableState)))
		})()

		baseState.stateRoots.set(newStateRoot, state)
		baseState.setCurrentStateRoot(newStateRoot)

		baseState.caches.accounts.commit()
		baseState.caches.contracts.commit()
		baseState.caches.storage.commit()

		baseState.options.onCommit?.(baseState)

		return
	}
