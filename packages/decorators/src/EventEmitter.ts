export type AnyEventName = string | symbol;
export type AnyListener = (...args: any[]) => void;

/**
 * A very minimal EventEmitter interface 
 */
export type EventEmitter = {
  /**
   * Register an event listener.
   * @param {string | symbol} eventName - The event name.
   * @param {Function} listener - The listener function.
   */
  on(eventName: AnyEventName, listener: AnyListener): void;
  /**
   * Remove an event listener.
   * @param {string | symbol} eventName - The event name.
   * @param {Function} listener - The listener function to remove.
   */
  removeListener(eventName: AnyEventName, listener: AnyListener): void;
  /**
   * Emit an event.
   * @param {string | symbol} eventName - The event name.
   * @param  {...any} args - Arguments to pass to the event listeners.
   * @returns {boolean} True if the event was emitted, false otherwise.
   */
  emit(eventName: AnyEventName, ...args: any[]): boolean;
}
