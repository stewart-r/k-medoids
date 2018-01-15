"use strict";
/* tslint:disable no-unused-expression*/
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const clusterer_1 = require("../src/Clusterer/clusterer");
const errorMessages = require("../src/Clusterer/errorMessages");
describe("Clusterer", () => {
    const sut = new clusterer_1.Clusterer();
    it("a Clusterer can be instantiated", () => {
        chai_1.expect(sut).to.not.be.null;
    });
    const testCase = [[1, 0], [2, 1], [0, 3], [-1, 4]];
    const testK = 2;
    describe(`given elements: ${JSON.stringify(testCase)}, k: ${testK}`, () => {
        describe(`with no explicit distance function`, () => {
            it("uses the euclidean distance function");
            it("returns a clustered array");
            it(`contains ${testCase.length} elements in total`);
        });
    });
    const testCase2 = [[1, 0], [2, 1], [0, 3], [-1, 4]];
    const testK2 = 10;
    describe(`given elements: ${JSON.stringify(testCase)}, k: ${testK}`, () => {
        it("Throws an error because k > elements.length", () => {
            chai_1.expect(() => sut.clusterElements(testCase2, testK2)).to.throw(errorMessages.kGtElementArrLength);
        });
    });
});
//# sourceMappingURL=test.js.map