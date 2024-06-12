'use strict';

var fs = require('fs');
var path = require('path');

// src/createTsupOptions.js

// src/targets.js
var nodeTargets = ["node16"];
var browserTargets = ["chrome91", "firefox90", "edge91", "safari15", "ios15", "opera77"];
var targets = {
  // target both node and browser applications
  js: browserTargets,
  // target node applications
  node: nodeTargets,
  // target browsers
  browser: browserTargets
};

// src/createTsupOptions.js
var createTsUpOptions = ({
  entry = ["src/index.js"],
  outDir = "dist",
  target = "js",
  format = ["cjs", "esm"]
}) => {
  const { name } = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8"));
  return {
    name,
    entry,
    outDir,
    target: targets[target],
    format,
    splitting: false,
    treeshake: true,
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

exports.browser = browser;
exports.createTsUpOptions = createTsUpOptions;
exports.js = js;
exports.node = node;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map