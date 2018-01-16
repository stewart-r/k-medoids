/* tslint:disable no-unused-expression*/
import { assert, expect } from "chai";
import "mocha";

import { Cluster } from "../../src/Clusterer/cluster";
import { testCase } from "./TestData/clusterTestCase1";

describe("Cluster", () => {

    const sut: Cluster<number[]> = new Cluster(testCase[0]);
    const tolerance = 0.05;

    it("can be instantiated", () => {
        expect(sut).to.not.be.null;
    });

    describe("when calculating costs", () => {
        describe(`given ${JSON.stringify(testCase[0])} and euclidean distance`, () => {
            it("calculates a cost", () => {
                const cost = sut.getCost();
            });

            const expectedCost = 3.162 + 4.472;
            it (`cost appx equal to: ${expectedCost}`, () => {
                const cost = sut.getCost();

                expect(Math.abs(cost - expectedCost )).to.be.lessThan(tolerance);
            });
        });
    });
});
