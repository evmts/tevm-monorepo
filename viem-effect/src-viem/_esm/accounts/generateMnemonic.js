import { generateMnemonic as generateMnemonic_ } from '@scure/bip39';
/**
 * @description Generates a random mnemonic phrase with a given wordlist.
 *
 * @param wordlist The wordlist to use for generating the mnemonic phrase.
 *
 * @returns A randomly generated mnemonic phrase.
 */
export function generateMnemonic(wordlist) {
    return generateMnemonic_(wordlist);
}
//# sourceMappingURL=generateMnemonic.js.map