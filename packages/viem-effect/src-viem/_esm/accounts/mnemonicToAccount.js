import { hdKeyToAccount } from './hdKeyToAccount.js'
import { HDKey } from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'
/**
 * @description Creates an Account from a mnemonic phrase.
 *
 * @returns A HD Account.
 */
export function mnemonicToAccount(mnemonic, opts = {}) {
	const seed = mnemonicToSeedSync(mnemonic)
	return hdKeyToAccount(HDKey.fromMasterSeed(seed), opts)
}
//# sourceMappingURL=mnemonicToAccount.js.map
