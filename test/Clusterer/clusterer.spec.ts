/* tslint:disable no-unused-expression*/
/* tslint:disable no-shadowed-variable*/

import { assert, expect } from "chai";
import * as combinatronics from "js-combinatorics";
import "mocha";

import { Cluster } from "../../src/Clusterer/cluster";
import { Clusterer } from "../../src/Clusterer/clusterer";
import * as errorMessages from "../../src/Clusterer/errorMessages";
import { distance as euclideanDistance } from "../../src/DistanceCalculators/euclidean";

describe("Clusterer", () => {
    const sut = Clusterer;
    const testCase = [[1.5, 0.5], [-1, 4], [1, 0], [1.5, 0], [2, 1], [0, 3], [-2, -2]];
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
            sut.allocateToClustersAroundCurrentMedoids();
            const clustersBeforeIteration = sut.Clusters;
            const iterated = sut.iterate();
            describe("after one iteration", () => {
                it("the clusters change", () => {
                    expect(iterated).to.be.true;
                    expect(sut.Clusters[0]).to.not.deep.equal(clustersBeforeIteration[0]);
                });

                it("the iteration count is: 1", () => {
                    expect(sut.IterationCount).to.equal(1);
                });

                it("Optimisation started", () => {
                    expect(sut.OptimisationStarted).to.be.true;
                });

            });
            sut.runToCompletion();
            describe("after runToCompletion", () => {
                it("the clusters change", () => {
                    expect(sut.Clusters[0]).to.not.deep.equal(clustersBeforeIteration[0]);
                });

                it("the iteration count is greater than zero", () => {
                    expect(sut.IterationCount).to.be.greaterThan(0);
                });

                it("Optimisation started", () => {
                    expect(sut.OptimisationStarted).to.be.true;
                });

                it("Optimisation complete", () => {
                    expect(sut.OptimisationCompleted).to.be.true;
                });

                it(`has ${testK} medoids`, () => {
                    expect(sut.Medoids).to.have.length(2);
                });

                it (`contains ${testCase.length} elements in total`, () => {
                    const totalNodes = sut
                        .Clusters
                        .map((c) => c.Elements.length)
                        .reduce((a, b) => a + b, 0);

                    expect(totalNodes).to.equal(testCase.length);
                });

                it ("no more efficient clustering can be found via an exhaustive search", () => {
                    const allPossibleMediodSets = combinatronics.combination(testCase, testK);
                    const allPossibleCosts = allPossibleMediodSets
                        .map((ms) => {
                            const clusterer = Clusterer.getInstance(testCase, testK);
                            clusterer.Medoids = ms;
                            clusterer.allocateToClustersAroundCurrentMedoids();
                            return clusterer.calculateCurrentCost();
                        });
                    const lowestCost = Math.min(...allPossibleCosts);
                    const toleranceForRoundingErrors = 0.0001;

                    expect(sut.calculateCurrentCost()).to.be.lessThan(lowestCost + toleranceForRoundingErrors);
                });

            });
        });
    });

    const testK2 = testCase.length + 1;

    describe(`given elements: ${JSON.stringify(testCase)}, k: ${testK2}`, () => {
        it ("Throws an error because k > elements.length", () => {
            expect(() => sut.clusterElements (testCase, testK2)).to.throw(errorMessages.kGtElementArrLength);
        });
    });
});
