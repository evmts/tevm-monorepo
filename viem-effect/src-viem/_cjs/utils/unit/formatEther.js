"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatEther = void 0;
const unit_js_1 = require("../../constants/unit.js");
const formatUnits_js_1 = require("./formatUnits.js");
function formatEther(wei, unit = 'wei') {
    return (0, formatUnits_js_1.formatUnits)(wei, unit_js_1.etherUnits[unit]);
}
exports.formatEther = formatEther;
//# sourceMappingURL=formatEther.js.map