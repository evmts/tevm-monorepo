// this file is adapted from viem
// see it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
// Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5
// We copy it here for easier developer experience internally and also
// to lock in these types independent of viem potentially making changes

export type EIP1193RequestOptions = {
	// The base delay (in ms) between retries.
	retryDelay?: number
	// The max number of times to retry.
	retryCount?: number
}
