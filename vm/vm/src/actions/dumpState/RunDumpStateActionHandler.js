
/**
 * @type {import("./RunDumpStateHandlerGeneric.js").RunDumpStateHandlerGeneric}
 */
export const RunDumpStateActionHandler = async ( tevm ) => {
  return await tevm._evm.stateManager.dumpState();
}