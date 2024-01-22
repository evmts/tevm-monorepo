var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// ts-plugin/index.ts
var tsPlugin = __require("@tevm/ts-plugin");
exports = tsPlugin;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map