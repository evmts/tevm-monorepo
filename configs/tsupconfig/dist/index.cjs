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
  browser: () => browser,
  createTsUpOptions: () => createTsUpOptions,
  js: () => js,
  node: () => node
});
module.exports = __toCommonJS(src_exports);

// src/targets.js
var nodeTargets = ["node16"];
var browserTargets = [
  "chrome91",
  "firefox90",
  "edge91",
  "safari15",
  "ios15",
  "opera77"
];
var targets = {
  // target both node and browser applications
  js: browserTargets,
  // target node applications
  node: nodeTargets,
  // target browsers
  browser: browserTargets
};

// src/createTsupOptions.js
var import_fs = require("fs");
var import_path = require("path");
var createTsUpOptions = ({
  entry = ["src/index.js"],
  target = "js",
  format = ["cjs", "esm"]
}) => {
  const { name } = JSON.parse(
    (0, import_fs.readFileSync)((0, import_path.join)(process.cwd(), "package.json"), "utf-8")
  );
  return {
    name,
    entry,
    outDir: "dist",
    target: targets[target],
    format,
    splitting: false,
    sourcemap: true,
    clean: false,
    skipNodeModulesBundle: true
  };
};

// src/browser.js
var browser = createTsUpOptions({
  target: "browser"
});

// src/js.js
var js = createTsUpOptions({
  target: "js"
});

// src/node.js
var node = createTsUpOptions({
  target: "node"
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  browser,
  createTsUpOptions,
  js,
  node
});
//# sourceMappingURL=index.cjs.map