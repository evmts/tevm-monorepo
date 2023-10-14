import type { ErrorType } from '../errors/utils.js'
import { generateMnemonic as generateMnemonic_ } from '@scure/bip39'

export type GenerateMnemonicErrorType = ErrorType

/**
 * @description Generates a random mnemonic phrase with a given wordlist.
 *
 * @param wordlist The wordlist to use for generating the mnemonic phrase.
 *
 * @returns A randomly generated mnemonic phrase.
 */
export function generateMnemonic(wordlist: string[]): string {
	return generateMnemonic_(wordlist)
}
