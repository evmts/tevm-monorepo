/**
 * Adds `value` to the state trie as code, and sets `codeHash` on the account
 * corresponding to `address` to reference this.
 * @type {import("../state-types/index.js").StateAction<'putContractCode'>}
 */
export const putContractCode = (baseState) => (address, value) => {
  baseState.caches.contracts.put(address, value)
  return Promise.resolve()
}
