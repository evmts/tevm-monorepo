"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var src_exports = {};
__export(src_exports, {
  AppState: () => AppState,
  BaseState: () => BaseState
});
module.exports = __toCommonJS(src_exports);

// src/BaseState.ts
var import_zustand = require("zustand");
var import_middleware = require("zustand/middleware");
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
    const persistMiddleware = this._options.persist ? import_middleware.persist : identityFn;
    if (enableDev) {
      return (0, import_zustand.create)(
        (0, import_middleware.devtools)(
          persistMiddleware((set, get) => {
            this.set = set;
            this.get = get;
            return { ...this };
          }, this._options.persist)
        )
      );
    }
    return (0, import_zustand.create)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AppState,
  BaseState
});
//# sourceMappingURL=index.cjs.map