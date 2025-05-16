import { storeEventsAbi } from "@latticexyz/store";
import type { StoreEventsLog } from "@latticexyz/store-sync";
import type { MemoryClient } from "@tevm/memory-client";
import type { RunTxResult } from "@tevm/vm";
import { parseEventLogs } from "viem";
import { ethjsLogToAbiLog } from "./ethjsLogToAbiLog.js";

/**
 * Subscribes to pending transactions in the MemoryClient, and simulates the pending block any time it's changed.
 *
 * This streams the decoded StoreEventsLogs aggregated from the pending transactions to the consumer.
 */
export const subscribePendingLogs = async (memoryClient: MemoryClient, onChange: (logs: StoreEventsLog[]) => void) => {
  const pool = await memoryClient.transport.tevm.getTxPool();
  const vm = await memoryClient.transport.tevm.getVm();

  const updatePendingLogs = async () => {
    const orderedTxs = await pool.txsByPriceAndNonce()
    let txResults: Array<RunTxResult> = []
    const vmCopy = orderedTxs.length > 0 ? await vm.deepCopy() : vm // we don't want to share the state with the client as it ran these already

    for (const tx of orderedTxs) {
      const txResult = await vmCopy.runTx({
        tx,
        skipBalance: true,
        skipNonce: true,
        skipHardForkValidation: true,
        skipBlockGasLimitValidation: true,
      })

      if (txResult.execResult.exceptionError) throw txResult.execResult.exceptionError;
      txResults.push(txResult)
    }

    const storeEventsLogs = parseEventLogs({
      abi: storeEventsAbi,
      logs: txResults.flatMap(tx => tx.receipt.logs.map((log) => ethjsLogToAbiLog(storeEventsAbi, log)))
    })
    memoryClient.transport.tevm.logger.debug("Updated pending logs for optimistic state", storeEventsLogs.length);
    onChange(storeEventsLogs)
  }

  pool.on("txadded",  () => updatePendingLogs);
  pool.on("txremoved", () => updatePendingLogs);
};
