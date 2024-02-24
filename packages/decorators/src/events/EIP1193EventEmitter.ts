import type { EIP1193EventMap, EIP1193Events } from "../eip1193/EIP1193Events.js";

/**
 * A very minimal EventEmitter interface 
 */
export type EIP1193EventEmitter = EIP1193Events & {
  /**
   * Emit an event.
   * @param {string | symbol} eventName - The event name.
   * @param  {...any} args - Arguments to pass to the event listeners.
   * @returns {boolean} True if the event was emitted, false otherwise.
   */
  emit(eventName: keyof EIP1193EventMap, ...args: any[]): boolean;
}
