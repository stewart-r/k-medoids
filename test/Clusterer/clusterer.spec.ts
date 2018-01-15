/* tslint:disable no-unused-expression*/
/* tslint:disable no-shadowed-variable*/

import { assert, expect } from "chai";
import "mocha";
import { Clusterer } from "../../src/Clusterer/clusterer";
import * as errorMessages from "../../src/Clusterer/errorMessages";
import { distance as euclideanDistance } from "../../src/DistanceCalculators/euclidean";

describe("Clusterer", () => {
    const sut = Clusterer;
    const testCase = [[1, 0], [2, 1], [0, 3], [-1, 4]];
    const testK = 2;

    describe(`given elements: ${JSON.stringify(testCase)}, k: ${testK}`, () => {
        const sut = Clusterer.getInstance(testCase, testK);
        it("a Clusterer can be instantiated", () => {
            expect(sut).to.not.be.null;
        });
        describe(`with no explicit distance function`, () => {
            it ("uses the euclidean distance function", () => {
                const distance = sut.DistanceFn([0, 3], [4, 0]);
                expect(distance).to.equal(5);
                expect(sut.DistanceFn).to.equal(euclideanDistance);
            });
            it ("returns a clustered array", () => {
                const result = sut.run();
                expect(result).to.be.an("array");
                expect(result).to.be.an("array");
            });
            it(`has ${testK} medoids after initialisation`, () => {
                expect(sut.Medoids).to.have.length(2);
            });
            it (`contains ${testCase.length} elements in total`, () => {
                const totalNodes = sut
                    .Clusters
                    .map((c) => c.Elements.length)
                    .reduce((a, b) => a + b, 0);

                expect(totalNodes).to.equal(testCase.length);
            });
        });
    });

    const testCase2 = [[1, 0], [2, 1], [0, 3], [-1, 4]];
    const testK2 = 10;

    describe(`given elements: ${JSON.stringify(testCase2)}, k: ${testK2}`, () => {
        it ("Throws an error because k > elements.length", () => {
            expect(() => sut.clusterElements (testCase2, testK2)).to.throw(errorMessages.kGtElementArrLength);
        });
    });
});
