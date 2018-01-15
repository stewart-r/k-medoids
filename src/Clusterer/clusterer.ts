import { distance as euclideanDistance, distance } from "../DistanceCalculators/euclidean";
import * as errorMessages from "./errorMessages";

import { ICluster } from "./cluster";

export class Clusterer<T> {
    public static clusterElements = <T extends {}>(elements: T[], k: number, distanceFn?: (t1: T, t2: T) => number) => {
        const instance = Clusterer.getInstance(elements, k, distanceFn);
        const ret: T[][] = new Array();
        return ret;
    }

    public static getInstance = <T extends {}>(elements: T[], k: number, distanceFn?: (t1: T, t2: T) => number) => {
        const instance = new Clusterer(elements, k, distanceFn);
        return instance;
    }

    public Medoids: T[];
    public Clusters: Array<ICluster<T>>;

    private constructor(
            public Elements: T[],
            public K: number,
            public DistanceFn?: (t1: T, t2: T) => number) {
        this.DistanceFn = this.DistanceFn || euclideanDistance;
        this.Medoids = this.selectInitialMedoids();
        this.Clusters = this.allocateToClusters();

    }

    public run = () => {
        const ret: T[][] = new Array();
        return ret;
    }

    private allocateToClusters = () => {
        const ret: Array<ICluster<T>> = new Array();
        this.Medoids.forEach((m) => {
            ret.push({
                Elements: [],
                Medoid: m,
            });
        });

        this.Elements.forEach((element, idx) => {
            const distances = this.findDistances(element);
            const idxOfMinDistance = distances
                .reduce((iMin, x, i, arr) =>  x < arr[iMin] ? i : iMin, Infinity);
            this.Clusters[idxOfMinDistance].Elements.push(element);
        });

        return ret;
    }

    private findDistances = (e: T) => {
        return this.Clusters.map((m) => this.DistanceFn(m.Medoid, e));
    }

    private selectInitialMedoids = () => {
        if (this.K >= this.Elements.length) {
            throw errorMessages.kGtElementArrLength;
        }
        const ret: T[] = [];
        for (let i = 0; i < this.K; i++) {
            ret.push(this.Elements[i]);
        }
        return ret;
    }
}
