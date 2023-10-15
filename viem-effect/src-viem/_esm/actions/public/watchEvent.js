import { observe } from '../../utils/observe.js';
import { poll } from '../../utils/poll.js';
import { stringify } from '../../utils/stringify.js';
import { DecodeLogDataMismatch, DecodeLogTopicsMismatch, } from '../../errors/abi.js';
import { InvalidInputRpcError } from '../../errors/rpc.js';
import { decodeEventLog, encodeEventTopics, formatLog, } from '../../utils/index.js';
import { createEventFilter, } from './createEventFilter.js';
import { getBlockNumber } from './getBlockNumber.js';
import { getFilterChanges } from './getFilterChanges.js';
import { getLogs } from './getLogs.js';
import { uninstallFilter } from './uninstallFilter.js';
/**
 * Watches and returns emitted [Event Logs](https://viem.sh/docs/glossary/terms.html#event-log).
 *
 * - Docs: https://viem.sh/docs/actions/public/watchEvent.html
 * - JSON-RPC Methods:
 *   - **RPC Provider supports `eth_newFilter`:**
 *     - Calls [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter) to create a filter (called on initialize).
 *     - On a polling interval, it will call [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges).
 *   - **RPC Provider does not support `eth_newFilter`:**
 *     - Calls [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs) for each block between the polling interval.
 *
 * This Action will batch up all the Event Logs found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchEvent.html#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/actions/public/watchEvent.html#onLogs).
 *
 * `watchEvent` will attempt to create an [Event Filter](https://viem.sh/docs/actions/public/createEventFilter.html) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs.html) instead.
 *
 * @param client - Client to use
 * @param parameters - {@link WatchEventParameters}
 * @returns A function that can be invoked to stop watching for new Event Logs. {@link WatchEventReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { watchEvent } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const unwatch = watchEvent(client, {
 *   onLogs: (logs) => console.log(logs),
 * })
 */
export function watchEvent(client, { address, args, batch = true, event, events, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_, }) {
    const enablePolling = typeof poll_ !== 'undefined' ? poll_ : client.transport.type !== 'webSocket';
    const strict = strict_ ?? false;
    const pollEvent = () => {
        const observerId = stringify([
            'watchEvent',
            address,
            args,
            batch,
            client.uid,
            event,
            pollingInterval,
        ]);
        return observe(observerId, { onLogs, onError }, (emit) => {
            let previousBlockNumber;
            let filter;
            let initialized = false;
            const unwatch = poll(async () => {
                if (!initialized) {
                    try {
                        filter = (await createEventFilter(client, {
                            address,
                            args,
                            event: event,
                            events,
                            strict,
                        }));
                    }
                    catch { }
                    initialized = true;
                    return;
                }
                try {
                    let logs;
                    if (filter) {
                        logs = await getFilterChanges(client, { filter });
                    }
                    else {
                        // If the filter doesn't exist, we will fall back to use `getLogs`.
                        // The fall back exists because some RPC Providers do not support filters.
                        // Fetch the block number to use for `getLogs`.
                        const blockNumber = await getBlockNumber(client);
                        // If the block number has changed, we will need to fetch the logs.
                        // If the block number doesn't exist, we are yet to reach the first poll interval,
                        // so do not emit any logs.
                        if (previousBlockNumber && previousBlockNumber !== blockNumber) {
                            logs = await getLogs(client, {
                                address,
                                args,
                                event: event,
                                events,
                                fromBlock: previousBlockNumber + 1n,
                                toBlock: blockNumber,
                            });
                        }
                        else {
                            logs = [];
                        }
                        previousBlockNumber = blockNumber;
                    }
                    if (logs.length === 0)
                        return;
                    if (batch)
                        emit.onLogs(logs);
                    else
                        logs.forEach((log) => emit.onLogs([log]));
                }
                catch (err) {
                    // If a filter has been set and gets uninstalled, providers will throw an InvalidInput error.
                    // Reinitalize the filter when this occurs
                    if (filter && err instanceof InvalidInputRpcError)
                        initialized = false;
                    emit.onError?.(err);
                }
            }, {
                emitOnBegin: true,
                interval: pollingInterval,
            });
            return async () => {
                if (filter)
                    await uninstallFilter(client, { filter });
                unwatch();
            };
        });
    };
    const subscribeEvent = () => {
        let active = true;
        let unsubscribe = () => (active = false);
        (async () => {
            try {
                const events_ = events ?? (event ? [event] : undefined);
                let topics = [];
                if (events_) {
                    topics = [
                        events_.flatMap((event) => encodeEventTopics({
                            abi: [event],
                            eventName: event.name,
                            args,
                        })),
                    ];
                    if (event)
                        topics = topics[0];
                }
                const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
                    params: ['logs', { address, topics }],
                    onData(data) {
                        if (!active)
                            return;
                        const log = data.result;
                        try {
                            const { eventName, args } = decodeEventLog({
                                abi: events_,
                                data: log.data,
                                topics: log.topics,
                                strict,
                            });
                            const formatted = formatLog(log, {
                                args,
                                eventName: eventName,
                            });
                            onLogs([formatted]);
                        }
                        catch (err) {
                            let eventName;
                            let isUnnamed;
                            if (err instanceof DecodeLogDataMismatch ||
                                err instanceof DecodeLogTopicsMismatch) {
                                // If strict mode is on, and log data/topics do not match event definition, skip.
                                if (strict_)
                                    return;
                                eventName = err.abiItem.name;
                                isUnnamed = err.abiItem.inputs?.some((x) => !('name' in x && x.name));
                            }
                            // Set args to empty if there is an error decoding (e.g. indexed/non-indexed params mismatch).
                            const formatted = formatLog(log, {
                                args: isUnnamed ? [] : {},
                                eventName,
                            });
                            onLogs([formatted]);
                        }
                    },
                    onError(error) {
                        onError?.(error);
                    },
                });
                unsubscribe = unsubscribe_;
                if (!active)
                    unsubscribe();
            }
            catch (err) {
                onError?.(err);
            }
        })();
        return unsubscribe;
    };
    return enablePolling ? pollEvent() : subscribeEvent();
}
//# sourceMappingURL=watchEvent.js.map