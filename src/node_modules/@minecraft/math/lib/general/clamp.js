"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.clampNumber = void 0;
/**
 * Clamps the passed in number to the passed in min and max values.
 *
 * @public
 */
function clampNumber(val, min, max) {
    return Math.min(Math.max(val, min), max);
}
exports.clampNumber = clampNumber;
//# sourceMappingURL=clamp.js.map