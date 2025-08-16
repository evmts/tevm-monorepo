import type { Address } from '@tevm/address';
import type { EvmResult, InterpreterStep } from '@tevm/evm';
/**
 * Event emitted when a new contract is created
 */
export interface NewContractEvent {
    /** Address of the newly created contract */
    address: Address;
    /** Deployed contract bytecode */
    code: Uint8Array;
}
/**
 * Message object representing a call to the EVM
 * This corresponds to the EVM's internal Message object
 */
export interface Message {
    /** Target address (undefined for contract creation) */
    to?: Address;
    /** Value sent with the call (in wei) */
    value: bigint;
    /** Address of the account that initiated this call */
    caller: Address;
    /** Gas limit for this call */
    gasLimit: bigint;
    /** Input data to the call */
    data: Uint8Array;
    /** Contract code for the call - can be bytecode or a precompile function */
    code?: Uint8Array | any;
    /** Call depth */
    depth: number;
    /** Whether the call is static (view) */
    isStatic: boolean;
    /** Whether this is precompiled contract code */
    isCompiled: boolean;
    /** Whether this is a DELEGATECALL */
    delegatecall: boolean;
    /** Salt for CREATE2 calls */
    salt?: Uint8Array;
    /** Origin address for AUTH calls */
    authcallOrigin?: Address;
    /** Gas refund counter */
    gasRefund?: bigint;
}
/**
 * Event handlers for EVM execution during a call
 * @example
 * ```typescript
 * import { createMemoryClient } from 'tevm'
 * import { tevmCall } from 'tevm/actions'
 *
 * const client = createMemoryClient()
 *
 * const result = await tevmCall(client, {
 *   to: '0x1234...',
 *   data: '0xabcdef...',
 *   onStep: (step, next) => {
 *     console.log(`Executing ${step.opcode.name} at PC=${step.pc}`)
 *     next?.()
 *   }
 * })
 * ```
 */
export type CallEvents = {
    /**
     * Handler called on each EVM step (instruction execution)
     * @param data Step information including opcode, stack, and memory state
     * @param next Function to continue execution - must be called to proceed
     */
    onStep?: (data: InterpreterStep, next?: () => void) => void;
    /**
     * Handler called when a new contract is created
     * @param data Contract creation information
     * @param next Function to continue execution - must be called to proceed
     */
    onNewContract?: (data: NewContractEvent, next?: () => void) => void;
    /**
     * Handler called before a message (call) is processed
     * @param data Message information
     * @param next Function to continue execution - must be called to proceed
     */
    onBeforeMessage?: (data: Message, next?: () => void) => void;
    /**
     * Handler called after a message (call) is processed
     * @param data Result information
     * @param next Function to continue execution - must be called to proceed
     */
    onAfterMessage?: (data: EvmResult, next?: () => void) => void;
};
//# sourceMappingURL=CallEvents.d.ts.map