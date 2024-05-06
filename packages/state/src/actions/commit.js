import { keccak256, numberToHex, toHex } from 'viem'
import { dumpCanonicalGenesis } from './dumpCannonicalGenesis.js'
import { saveStateRoot } from './saveStateRoot.js'

// TODO we might want to sometimes prune state roots

/**
 * Commits the current change-set to the instance since the
 * last call to checkpoint.
 * @type {import("../state-types/index.js").StateAction<'commit'>}
 */
export const commit =
	(baseState) =>
	async (createNewStateRoot = false) => {
		baseState._caches.accounts.commit()
		baseState._caches.contracts.commit()
		baseState._caches.storage.commit()
		// This is kinda hacky we are just ranodmly generating new state roots
		// since we don't use a trie we are kinda hacking this
		// This might be needlessy slow as state gets big but for now it feels the most rubust wrt correctness
		const state = await dumpCanonicalGenesis(baseState)()
		/**
		 * @type {import('@tevm/state').ParameterizedTevmState}
		 */
		const jsonSerializableState = {}

		for (const [k, v] of Object.entries(state)) {
			const { nonce, balance, storageRoot, codeHash } = v
			jsonSerializableState[k] = {
				...v,
				nonce: numberToHex(nonce),
				balance: numberToHex(balance),
				storageRoot: storageRoot,
				codeHash: codeHash,
			}
		}
		const newStateRoot = createNewStateRoot
			? keccak256(toHex(JSON.stringify(jsonSerializableState)), 'bytes')
			: baseState._currentStateRoot
		saveStateRoot(baseState)(newStateRoot, state)
		baseState._currentStateRoot = newStateRoot
		baseState._options.onCommit?.(baseState)
		return Promise.resolve()
	}
