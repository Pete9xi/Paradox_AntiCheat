"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const coreHelpers_1 = require("./coreHelpers");
(0, vitest_1.describe)('Vector3 operations', () => {
    const v1 = { x: 1, y: 2, z: 3 };
    const v2 = { x: 4, y: 5, z: 6 };
    (0, vitest_1.it)('successfully compares vectors', () => {
        const v3 = { x: 1, y: 2, z: 3 };
        (0, vitest_1.expect)(coreHelpers_1.Vector3Utils.equals(v1, v3)).toBe(true);
        (0, vitest_1.expect)(coreHelpers_1.Vector3Utils.equals(v1, v2)).toBe(false);
    });
    (0, vitest_1.it)('successfully adds vectors and returns a new vector', () => {
        const result = coreHelpers_1.Vector3Utils.add(v1, v2);
        (0, vitest_1.expect)(result).toEqual({ x: 5, y: 7, z: 9 });
        (0, vitest_1.expect)(result).not.toBe(v1);
    });
    (0, vitest_1.it)('successfully subtracts vectors and returns a new vector', () => {
        const result = coreHelpers_1.Vector3Utils.subtract(v1, v2);
        (0, vitest_1.expect)(result).toEqual({ x: -3, y: -3, z: -3 });
        (0, vitest_1.expect)(result).not.toBe(v1);
    });
    (0, vitest_1.it)('successfully scales a vector and returns a new vector', () => {
        const result = coreHelpers_1.Vector3Utils.scale(v1, 2);
        (0, vitest_1.expect)(result).toEqual({ x: 2, y: 4, z: 6 });
        (0, vitest_1.expect)(result).not.toBe(v1);
    });
    (0, vitest_1.it)('successfully computes the dot product of a vector', () => {
        const result = coreHelpers_1.Vector3Utils.dot(v1, v2);
        (0, vitest_1.expect)(result).toBe(32);
    });
    (0, vitest_1.it)('successfully computes the dot product of a vector with a 0 vector', () => {
        const result = coreHelpers_1.Vector3Utils.dot(v1, { x: 0, y: 0, z: 0 });
        (0, vitest_1.expect)(result).toBe(0);
    });
    (0, vitest_1.it)('successfully computes the cross product of a vector and returns a new vector', () => {
        const result = coreHelpers_1.Vector3Utils.cross(v1, v2);
        (0, vitest_1.expect)(result).toEqual({ x: -3, y: 6, z: -3 });
        (0, vitest_1.expect)(result).not.toBe(v1);
        (0, vitest_1.expect)(result).not.toBe(v2);
    });
    (0, vitest_1.it)('returns a zero vector for a cross product of parallel vectors', () => {
        const result = coreHelpers_1.Vector3Utils.cross({ x: 3, y: 0, z: 0 }, { x: 7, y: 0, z: 0 });
        (0, vitest_1.expect)(result).toEqual({ x: 0, y: 0, z: 0 });
    });
    (0, vitest_1.it)('returns a zero vector for a cross product of with a zero vector', () => {
        const result = coreHelpers_1.Vector3Utils.cross(v1, { x: 0, y: 0, z: 0 });
        (0, vitest_1.expect)(result).toEqual({ x: 0, y: 0, z: 0 });
        (0, vitest_1.expect)(result).not.toBe(v1);
    });
    (0, vitest_1.it)('returns the unit z vector for a cross product of unit x and unit y vectors', () => {
        const result = coreHelpers_1.Vector3Utils.cross({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 });
        (0, vitest_1.expect)(result).toEqual({ x: 0, y: 0, z: 1 });
    });
    (0, vitest_1.it)('calculates the magnitude', () => {
        const result = coreHelpers_1.Vector3Utils.magnitude(v1);
        (0, vitest_1.expect)(result).toBeCloseTo(3.74, 2);
    });
    (0, vitest_1.it)('calculates the distance between two vectors', () => {
        const result = coreHelpers_1.Vector3Utils.distance(v1, v2);
        (0, vitest_1.expect)(result).toBeCloseTo(5.2, 2);
    });
    (0, vitest_1.it)('computes the floor of the vector', () => {
        const input = { x: 1.33, y: 2.14, z: 3.55 };
        const expected = { x: 1, y: 2, z: 3 };
        (0, vitest_1.expect)(coreHelpers_1.Vector3Utils.floor(input)).toEqual(expected);
    });
    (0, vitest_1.it)('computes the floor of negative vectors', () => {
        const input = { x: -1.33, y: -2.14, z: -3.55 };
        const expected = { x: -2, y: -3, z: -4 };
        (0, vitest_1.expect)(coreHelpers_1.Vector3Utils.floor(input)).toEqual(expected);
    });
    (0, vitest_1.it)('normalizes the vector', () => {
        const result = coreHelpers_1.Vector3Utils.normalize(v1);
        (0, vitest_1.expect)(result.x).toBeCloseTo(0.27, 2);
        (0, vitest_1.expect)(result.y).toBeCloseTo(0.53, 2);
        (0, vitest_1.expect)(result.z).toBeCloseTo(0.8, 2);
    });
    (0, vitest_1.it)('converts a vector to a string with default options', () => {
        const vector = { x: 1, y: 2, z: 3 };
        const expectedString = '1.00, 2.00, 3.00';
        (0, vitest_1.expect)(coreHelpers_1.Vector3Utils.toString(vector)).toBe(expectedString);
        (0, vitest_1.expect)(coreHelpers_1.Vector3Utils.toString(vector, undefined)).toBe(expectedString);
        (0, vitest_1.expect)(coreHelpers_1.Vector3Utils.toString(vector, { decimals: undefined, delimiter: undefined })).toBe(expectedString);
    });
    (0, vitest_1.it)('converts a vector to a string with overridden options', () => {
        const vector = { x: 1.23456789, y: 2.99, z: 3 };
        const expectedString1 = '1.2346|2.9900|3.0000'; // toFixed performs rounding
        (0, vitest_1.expect)(coreHelpers_1.Vector3Utils.toString(vector, { decimals: 4, delimiter: '|' })).toBe(expectedString1);
        const expectedString2 = '1|3|3';
        (0, vitest_1.expect)(coreHelpers_1.Vector3Utils.toString(vector, { decimals: 0, delimiter: '|' })).toBe(expectedString2);
        const expectedString3 = '1, 3, 3';
        (0, vitest_1.expect)(coreHelpers_1.Vector3Utils.toString(vector, { decimals: 0 })).toBe(expectedString3);
        const expectedString4 = '1.23|2.99|3.00';
        (0, vitest_1.expect)(coreHelpers_1.Vector3Utils.toString(vector, { delimiter: '|' })).toBe(expectedString4);
    });
    (0, vitest_1.it)('converts a vector2 to a string with default options', () => {
        const vector = { x: 1, y: 2 };
        const expectedString = '1.00, 2.00';
        (0, vitest_1.expect)(coreHelpers_1.Vector2Utils.toString(vector)).toBe(expectedString);
        (0, vitest_1.expect)(coreHelpers_1.Vector2Utils.toString(vector, undefined)).toBe(expectedString);
        (0, vitest_1.expect)(coreHelpers_1.Vector2Utils.toString(vector, { decimals: undefined, delimiter: undefined })).toBe(expectedString);
    });
    (0, vitest_1.it)('converts a vector2 to a string with overridden options', () => {
        const vector = { x: 1.23456789, y: 2.99 };
        const expectedString1 = '1.2346|2.9900'; // toFixed performs rounding
        (0, vitest_1.expect)(coreHelpers_1.Vector2Utils.toString(vector, { decimals: 4, delimiter: '|' })).toBe(expectedString1);
        const expectedString2 = '1|3';
        (0, vitest_1.expect)(coreHelpers_1.Vector2Utils.toString(vector, { decimals: 0, delimiter: '|' })).toBe(expectedString2);
        const expectedString3 = '1, 3';
        (0, vitest_1.expect)(coreHelpers_1.Vector2Utils.toString(vector, { decimals: 0 })).toBe(expectedString3);
        const expectedString4 = '1.23|2.99';
        (0, vitest_1.expect)(coreHelpers_1.Vector2Utils.toString(vector, { delimiter: '|' })).toBe(expectedString4);
    });
    (0, vitest_1.describe)('clamp', () => {
        const v = { x: 1, y: 1, z: 3 };
        const minVec = { x: 0, y: 1.5 };
        const maxVec = { x: 2, z: 2.5 };
        (0, vitest_1.it)('clamps with defaults (no min or max)', () => {
            const result = coreHelpers_1.Vector3Utils.clamp(v);
            (0, vitest_1.expect)(result).toEqual({ x: 1, y: 1, z: 3 });
        });
        (0, vitest_1.it)('clamps properly with both min and max', () => {
            const result = coreHelpers_1.Vector3Utils.clamp(v, { min: minVec, max: maxVec });
            (0, vitest_1.expect)(result).toEqual({ x: 1, y: 1.5, z: 2.5 });
        });
        (0, vitest_1.it)('clamps with min only', () => {
            const result = coreHelpers_1.Vector3Utils.clamp(v, { min: minVec });
            (0, vitest_1.expect)(result).toEqual({ x: 1, y: 1.5, z: 3 });
        });
        (0, vitest_1.it)('clamps with max only', () => {
            const result = coreHelpers_1.Vector3Utils.clamp(v, { max: maxVec });
            (0, vitest_1.expect)(result).toEqual({ x: 1, y: 1, z: 2.5 });
        });
        (0, vitest_1.it)('clamp with zero vector and positive mins and negative max', () => {
            const vZero = { x: 0, y: 0, z: 0 };
            const min = { y: 1.5 };
            const max = { z: -2.5 };
            const result = coreHelpers_1.Vector3Utils.clamp(vZero, { min, max });
            (0, vitest_1.expect)(result).toEqual({ x: 0, y: 1.5, z: -2.5 });
        });
        // Test clamp function with large vector
        const vLarge = { x: 1e6, y: 1e6, z: 1e6 };
        (0, vitest_1.it)('clamp with large vector', () => {
            const result = coreHelpers_1.Vector3Utils.clamp(vLarge, { min: minVec, max: maxVec });
            (0, vitest_1.expect)(result).toEqual({ x: 2, y: 1e6, z: 2.5 });
        });
    });
    (0, vitest_1.it)('calculates the lerp halfway between two vectors', () => {
        const result = coreHelpers_1.Vector3Utils.lerp(v1, v2, 0.5);
        (0, vitest_1.expect)(result).toEqual({ x: 2.5, y: 3.5, z: 4.5 });
    });
    (0, vitest_1.it)('calculates the slerp halfway between two vectors', () => {
        const vecA = { x: 1, y: 0, z: 0 };
        const vecB = { x: 0, y: -1, z: 0 };
        const result = coreHelpers_1.Vector3Utils.slerp(vecA, vecB, 0.5);
        (0, vitest_1.expect)(result.x).toBeCloseTo(0.7071, 3);
        (0, vitest_1.expect)(result.y).toBeCloseTo(-0.7071, 3);
        (0, vitest_1.expect)(result.z).toBeCloseTo(0);
    });
});
//# sourceMappingURL=coreHelpers.test.js.map