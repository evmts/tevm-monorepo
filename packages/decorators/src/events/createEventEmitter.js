/**
 * Factory function to create an event emitter.
 * @returns {import('@tevm/base-client').Extension<import('./EIP1193EventEmitter.js').EIP1193EventEmitter>}
 */
export const createEventEmitter = () => () => {
  /** @type {Map<string | symbol, Array<Function>>} */
  let events = new Map();

  return {
    on(eventName, listener) {
      const listeners = events.get(eventName) || [];
      listeners.push(listener);
      events.set(eventName, listeners);
    },

    removeListener(eventName, listener) {
      const listeners = events.get(eventName);
      if (listeners) {
        const index = listeners.findIndex(l => l === listener);
        if (index !== -1) {
          listeners.splice(index, 1);
          if (listeners.length === 0) {
            events.delete(eventName);
          }
        }
      }
    },

    emit(eventName, ...args) {
      const listeners = events.get(eventName);
      if (listeners && listeners.length) {
        listeners.forEach(listener => listener(...args));
        return true; // Event was successfully emitted
      }
      return false; // No listeners for the event
    }
  };
}

