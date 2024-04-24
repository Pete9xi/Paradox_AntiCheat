"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const coreHelpers_1 = require("./coreHelpers");
const vectorWrapper_1 = require("./vectorWrapper");
/**
 * Underlying functionality is validated by coreHelpers tests, primary concern here is consistency of results
 * between the two implementations
 */
(0, vitest_1.describe)('Vector3Builder', () => {
    (0, vitest_1.it)('should be able to be constructed from a Vector3 or three nunmbers', () => {
        const vectorA = new vectorWrapper_1.Vector3Builder({ x: 1, y: 2, z: 3 });
        const vectorB = new vectorWrapper_1.Vector3Builder(1, 2, 3);
        (0, vitest_1.expect)(vectorA.x).toBe(1);
        (0, vitest_1.expect)(vectorA.y).toBe(2);
        (0, vitest_1.expect)(vectorA.z).toBe(3);
        (0, vitest_1.expect)(vectorA).toEqual(vectorB);
    });
    (0, vitest_1.it)('should be able to assign a Vector3', () => {
        const vector = new vectorWrapper_1.Vector3Builder(1, 2, 3);
        const updated = vector.assign({ x: 4, y: 5, z: 6 });
        (0, vitest_1.expect)(updated.x).toBe(4);
        (0, vitest_1.expect)(updated.y).toBe(5);
        (0, vitest_1.expect)(updated.z).toBe(6);
        (0, vitest_1.expect)(updated).toBe(vector); // Referential equality must be preserved
    });
    (0, vitest_1.it)('should be able to check equality with the same result as the coreHelpers function', () => {
        const vectorA = new vectorWrapper_1.Vector3Builder(1, 2, 3);
        const vectorB = new vectorWrapper_1.Vector3Builder(1, 2, 3);
        const vectorC = new vectorWrapper_1.Vector3Builder(4, 5, 6);
        (0, vitest_1.expect)(vectorA.equals(vectorB)).toBe(coreHelpers_1.Vector3Utils.equals(vectorA, vectorB));
        (0, vitest_1.expect)(vectorA.equals(vectorC)).toBe(coreHelpers_1.Vector3Utils.equals(vectorA, vectorC));
    });
    (0, vitest_1.it)('should be able to add a vector3 with the same result as the coreHelpers function', () => {
        const vectorA = new vectorWrapper_1.Vector3Builder(1, 2, 3);
        const vectorB = new vectorWrapper_1.Vector3Builder(4, 5, 6);
        const vectorC = coreHelpers_1.Vector3Utils.add(vectorA, vectorB);
        const result = vectorA.add(vectorB);
        (0, vitest_1.expect)(result).toEqual(vectorC);
        (0, vitest_1.expect)(vectorA).toBe(result); // Referential equality must be preserved
        // Subsequent chained adds should work as expected
        const toAdd = { x: 1, y: 1, z: 1 };
        const resultTwo = vectorA.add(toAdd).add(toAdd).add(toAdd);
        (0, vitest_1.expect)(resultTwo).toEqual({ x: 8, y: 10, z: 12 });
        (0, vitest_1.expect)(resultTwo).toBe(vectorA); // Referential equality must be preserved
    });
    (0, vitest_1.it)('should be able to subtract a vector3 with the same result as the coreHelpers function', () => {
        const vectorA = new vectorWrapper_1.Vector3Builder(5, 7, 9);
        const vectorB = new vectorWrapper_1.Vector3Builder(4, 5, 6);
        const vectorC = coreHelpers_1.Vector3Utils.subtract(vectorA, vectorB);
        const result = vectorA.subtract(vectorB);
        (0, vitest_1.expect)(result).toEqual(vectorC);
        (0, vitest_1.expect)(vectorA).toBe(result); // Referential equality must be preserved
        // Subsequent chained subtracts should work as expected
        const toSubtract = { x: 1, y: 1, z: 1 };
        const resultTwo = vectorA.subtract(toSubtract).subtract(toSubtract).subtract(toSubtract);
        (0, vitest_1.expect)(resultTwo).toEqual({ x: -2, y: -1, z: 0 });
        (0, vitest_1.expect)(resultTwo).toBe(vectorA); // Referential equality must be preserved
    });
    (0, vitest_1.it)('should be able to scale a vector3 with the same result as the coreHelpers function', () => {
        const vectorA = new vectorWrapper_1.Vector3Builder(1, 2, 3);
        const vectorB = coreHelpers_1.Vector3Utils.scale(vectorA, 3);
        const result = vectorA.scale(3);
        (0, vitest_1.expect)(result).toEqual(vectorB);
        (0, vitest_1.expect)(vectorA).toBe(result); // Referential equality must be preserved
        // Subsequent chained subtracts should work as expected
        const resultTwo = vectorA.scale(3).scale(3);
        (0, vitest_1.expect)(resultTwo).toEqual({ x: 27, y: 54, z: 81 });
        (0, vitest_1.expect)(resultTwo).toBe(vectorA); // Referential equality must be preserved
    });
    (0, vitest_1.it)('should be able to compute the dot product with the same result as the coreHelpers function', () => {
        const vectorA = new vectorWrapper_1.Vector3Builder(1, 2, 3);
        const vectorB = new vectorWrapper_1.Vector3Builder(4, 5, 6);
        const dotProduct = coreHelpers_1.Vector3Utils.dot(vectorA, vectorB);
        const result = vectorA.dot(vectorB);
        (0, vitest_1.expect)(result).toEqual(dotProduct);
    });
    (0, vitest_1.it)('should be able to compute the cross product with the same result as the coreHelpers function', () => {
        const vectorA = new vectorWrapper_1.Vector3Builder(1, 2, 3);
        const vectorB = new vectorWrapper_1.Vector3Builder(4, 5, 6);
        const vectorC = coreHelpers_1.Vector3Utils.cross(vectorA, vectorB);
        const result = vectorA.cross(vectorB);
        (0, vitest_1.expect)(result).toEqual(vectorC);
        (0, vitest_1.expect)(vectorA).toBe(result); // Referential equality must be preserved
        // Subsequent chained subtracts should work as expected
        const toCross = { x: 1, y: 1, z: 1 };
        const resultTwo = vectorA.cross(toCross).cross(toCross);
        (0, vitest_1.expect)(resultTwo).toEqual({ x: 9, y: -18, z: 9 });
        (0, vitest_1.expect)(resultTwo).toBe(vectorA); // Referential equality must be preserved
    });
    (0, vitest_1.it)('should be able to compute the magnitude with the same result as the coreHelpers function', () => {
        const vectorA = new vectorWrapper_1.Vector3Builder(1, 2, 3);
        const mag = coreHelpers_1.Vector3Utils.magnitude(vectorA);
        (0, vitest_1.expect)(vectorA.magnitude()).toEqual(mag);
    });
    (0, vitest_1.it)('should be able to compute the distance between two vectors with the same result as the coreHelpers function', () => {
        const vectorA = new vectorWrapper_1.Vector3Builder(1, 2, 3);
        const vectorB = new vectorWrapper_1.Vector3Builder(4, 5, 6);
        const mag = coreHelpers_1.Vector3Utils.distance(vectorA, vectorB);
        (0, vitest_1.expect)(vectorA.distance(vectorB)).toEqual(mag);
    });
    (0, vitest_1.it)('should be able to normalize the vector with the same result as the coreHelpers function', () => {
        const vectorA = new vectorWrapper_1.Vector3Builder(1, 2, 3);
        const vectorB = coreHelpers_1.Vector3Utils.normalize(vectorA);
        const result = vectorA.normalize();
        (0, vitest_1.expect)(result).toEqual(vectorB);
        (0, vitest_1.expect)(vectorA).toBe(result); // Referential equality must be preserved
    });
    (0, vitest_1.it)('should be able to compute the floor of the vector with the same result as the coreHelpers function', () => {
        const vectorA = new vectorWrapper_1.Vector3Builder(1.33, 2.14, 3.55);
        const vectorB = coreHelpers_1.Vector3Utils.floor(vectorA);
        const result = vectorA.floor();
        (0, vitest_1.expect)(result).toEqual(vectorB);
        (0, vitest_1.expect)(vectorA).toBe(result); // Referential equality must be preserved
    });
    (0, vitest_1.it)('should be able to clamp the vector with the same result as the coreHelpers function', () => {
        const vectorA = new vectorWrapper_1.Vector3Builder(1, 2, 3);
        const minVec = { x: 0, y: 1.5 };
        const maxVec = { x: 2, z: 2.5 };
        const vectorB = coreHelpers_1.Vector3Utils.clamp(vectorA, { min: minVec, max: maxVec });
        const result = vectorA.clamp({ min: minVec, max: maxVec });
        (0, vitest_1.expect)(result).toEqual(vectorB);
        (0, vitest_1.expect)(vectorA).toBe(result); // Referential equality must be preserved
    });
    (0, vitest_1.it)('should be able to compute a string representation of the vector with the same result as the coreHelpers function', () => {
        const vectorA = new vectorWrapper_1.Vector3Builder(1.33, 2.14, 3.55);
        const vectorB = coreHelpers_1.Vector3Utils.toString(vectorA, { decimals: 1, delimiter: ' ' });
        const result = vectorA.toString({ decimals: 1, delimiter: ' ' });
        (0, vitest_1.expect)(result).toEqual(vectorB);
    });
    (0, vitest_1.it)('should be able compute the lerp halfway between two vectors with the same result as the coreHelpers function', () => {
        const vectorA = new vectorWrapper_1.Vector3Builder(5, 6, 3);
        const vectorB = new vectorWrapper_1.Vector3Builder(4, 2, 6);
        const ratio = 0.4;
        const resultA = coreHelpers_1.Vector3Utils.lerp(vectorA, vectorB, ratio);
        const resultB = vectorA.lerp(vectorB, ratio);
        (0, vitest_1.expect)(resultA).toEqual(resultB);
    });
    (0, vitest_1.it)('should be able compute the slerp halfway between two vectors with the same result as the coreHelpers function', () => {
        const vectorA = new vectorWrapper_1.Vector3Builder(5, 6, 3);
        const vectorB = new vectorWrapper_1.Vector3Builder(4, 2, 6);
        const ratio = 0.4;
        const resultA = coreHelpers_1.Vector3Utils.slerp(vectorA, vectorB, ratio);
        const resultB = vectorA.slerp(vectorB, ratio);
        (0, vitest_1.expect)(resultA).toEqual(resultB);
    });
});
(0, vitest_1.describe)('Vector2Builder', () => {
    (0, vitest_1.it)('should be able to compute a string representation of the vector with the same result as the coreHelpers function', () => {
        const vectorA = new vectorWrapper_1.Vector2Builder(1.33, 2.14);
        const vectorB = coreHelpers_1.Vector2Utils.toString(vectorA, { decimals: 1, delimiter: ' ' });
        const result = vectorA.toString({ decimals: 1, delimiter: ' ' });
        (0, vitest_1.expect)(result).toEqual(vectorB);
    });
});
//# sourceMappingURL=vectorWrapper.test.js.map