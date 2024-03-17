/**
 * Types for the central event bus, emitted
 * by different components of the client.
 */
export enum Event {
	CHAIN_UPDATED = 'blockchain:chain:updated',
	CLIENT_SHUTDOWN = 'client:shutdown',
	SYNC_EXECUTION_VM_ERROR = 'sync:execution:vm:error',
	SYNC_FETCHED_BLOCKS = 'sync:fetcher:fetched_blocks',
	SYNC_FETCHED_HEADERS = 'sync:fetcher:fetched_headers',
	SYNC_SYNCHRONIZED = 'sync:synchronized',
	SYNC_ERROR = 'sync:error',
	SYNC_FETCHER_ERROR = 'sync:fetcher:error',
	SYNC_SNAPSYNC_COMPLETE = 'sync:snapsync:complete',
	PEER_CONNECTED = 'peer:connected',
	PEER_DISCONNECTED = 'peer:disconnected',
	PEER_ERROR = 'peer:error',
	SERVER_LISTENING = 'server:listening',
	SERVER_ERROR = 'server:error',
	POOL_PEER_ADDED = 'pool:peer:added',
	POOL_PEER_REMOVED = 'pool:peer:removed',
	POOL_PEER_BANNED = 'pool:peer:banned',
	PROTOCOL_ERROR = 'protocol:error',
	PROTOCOL_MESSAGE = 'protocol:message',
}
