"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeNet = computeNet;
function computeNet(basic, allowances, advance, deduction) {
    return basic + allowances - advance - deduction;
}
