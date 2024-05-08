/**
 * @type {import("../state-types/index.js").StateAction<'getAccountAddresses'>}
 */
export const getAccountAddresses = (baseState) => () => {
  /**
   * @type {string[]}
   */
  const accountAddresses = []
  //Tevm initializes stateManager account cache with an ordered map cache
  baseState.caches.accounts._orderedMapCache?.forEach((e) => {
    accountAddresses.push(e[0])
  })
  return /** @type {import("viem").Address[]}*/ (accountAddresses)
}
