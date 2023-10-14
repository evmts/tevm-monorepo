// src/BaseState.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
var identityFn = (thing) => thing;
var VALID_KEYS = /* @__PURE__ */ new Set(["get", "set", "createStore"]);
var BaseState = class {
  constructor(_options = { persist: void 0 }) {
    this._options = _options;
    return new Proxy(this, {
      get(target, prop) {
        if (!VALID_KEYS.has(prop)) {
          throw new Error(
            `Access state with this.get().${String(
              prop
            )} rather than this.${String(prop)}`
          );
        }
        return target[prop];
      }
    });
  }
  /**
   * Get latest zustand state
   */
  get;
  /**
   * Set zustand state.   Zustand will automatically
   * persist the other keys in the state.
   *
   * @see https://docs.pmnd.rs/zustand/guides/updating-state
   */
  set;
  /**
   * @parameter enableDev
   * @returns zustand store
   */
  createStore = (enableDev = false) => {
    const persistMiddleware = this._options.persist ? persist : identityFn;
    if (enableDev) {
      return create(
        devtools(
          persistMiddleware((set, get) => {
            this.set = set;
            this.get = get;
            return { ...this };
          }, this._options.persist)
        )
      );
    }
    return create(
      persistMiddleware((set, get) => {
        this.set = set;
        this.get = get;
        return this;
      }, this._options.persist)
    );
  };
};

// src/AppState.ts
var AppState = class extends BaseState {
  /**
   * Hello world
   */
  count = 0;
  /**
   * Hello world
   */
  setCount = (count) => this.set({ count });
};
export {
  AppState,
  BaseState
};
//# sourceMappingURL=index.js.map