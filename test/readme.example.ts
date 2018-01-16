/* tslint:disable no-unused-expression*/
/* tslint:disable no-shadowed-variable*/

import { assert, expect } from "chai";
import * as combinatronics from "js-combinatorics";
import "mocha";

import { Cluster, Clusterer } from "../src/index";

describe("Example for readme", () => {
    it("runs without error", () => {
        const k = 2;
        const myData = [
            [1, 2],
            [1, 3],
            [-1, 2.5],
            [0, 0],
            [510, 203],
            [-100, 120],
        ];

        const clusterer = Clusterer.getInstance(myData, 2);
        const clusteredData = clusterer.getClusteredData();

        // tslint:disable-next-line:no-console
        console.log(JSON.stringify(clusteredData));

        const myFunkyDistanceFn = (a: number[], b: number[]) => {
            return Math.abs(a[1] - b[1]);
        };

        const myClusterer = Clusterer.getInstance(myData, 2, myFunkyDistanceFn);
        const data = myClusterer.getClusteredData();
        // tslint:disable-next-line:no-console
        console.log(JSON.stringify(data));

        const myWidgets = [
            {
                Name: "DoHickey",
                Weight: 10,
            },
            {
                Name: "Thingy",
                Weight: 10.5,
            },
            {
                Name: "Whatsit",
                Weight: 9.5,
            },
            {
                Name: "Bohemoth",
                Weight: 120,
            },
            {
                Name: "Goliath",
                Weight: 125,
            },
        ];

        const myWidgetClusterer = Clusterer.getInstance(myWidgets, 2, (a, b) => {
            return Math.abs(a.Weight - b.Weight);
        });
        const groupedWidgets = myWidgetClusterer.getClusteredData();

        // tslint:disable-next-line:no-console
        console.log(JSON.stringify(groupedWidgets));
    });
});
