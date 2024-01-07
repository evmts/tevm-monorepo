
/**
 * @type {import("./RunLoadStateHandlerGeneric.js").RunLoadStateActionHandler}
 */
export const RunLoadStateActionHandler = async ( tevm, tevmState ) => {
  await tevm._evm.stateManager.loadState(tevmState);
}