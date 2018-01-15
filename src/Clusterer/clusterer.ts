import { distance as euclideanDistance } from "../DistanceCalculators/euclidean";
import * as errorMessages from "./errorMessages";

import { Cluster } from "./cluster";

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
    public Clusters: Array<Cluster<T>>;
    public IterationCount: number;
    public get OptimisationStarted() {
        return this.IterationCount > 0;
    }
    public OptimisationCompleted = false;

    private constructor(
            public Elements: T[],
            public K: number,
            public DistanceFn?: (t1: T, t2: T) => number) {
        this.DistanceFn = this.DistanceFn || euclideanDistance;
        this.Medoids = this.selectInitialMedoids();
        this.IterationCount = 0;

    }

    public iterate = () => {
        if (!this.Clusters) {
            this.allocateToClustersAroundCurrentMedoids();
        }
        const medoidsB4Iter = this.Medoids;
        const clustersB4Iter = this.Clusters;
        const costBeforeIteration = this.calculateCurrentCost();

        this.Medoids = [];

        this.Clusters.forEach((c) => {
            const bestAvailableMedoid = c.Elements[ c.findBestMedoidIdx(this.DistanceFn)];
            this.Medoids.push(bestAvailableMedoid.Element);
        });
        this.allocateToClustersAroundCurrentMedoids();

        const newCost = this.calculateCurrentCost();

        if (newCost < costBeforeIteration) {
            this.IterationCount++;
            return true;
        } else {
            this.Clusters = clustersB4Iter;
            this.Medoids = medoidsB4Iter;
            this.OptimisationCompleted = true;
            return false;
        }
    }

    public runToCompletion = () => {
        // tslint:disable-next-line:curly
        while (this.iterate());
    }

    public allocateToClustersAroundCurrentMedoids = () => {
        this.Clusters = new Array();
        this.Medoids.forEach((m) => {
            this.Clusters.push(new Cluster({
                Elements: [],
                Medoid: m,
            }));
        });

        this.Elements.forEach((element, idx) => {
            const distances = this.findDistances(this.Clusters.map((c) => c.Medoid), element);
            const idxOfMinDistance = distances
                .reduce((iMin, x, i, arr) =>  x < arr[iMin] ? i : iMin, 0);
            this.Clusters[idxOfMinDistance].Elements.push({
                DistanceFromMedoid: distances[idxOfMinDistance],
                Element: element,
            });
        });
    }

    public calculateCurrentCost = () => {
        return this.Clusters.map((c) => c.getCost()).reduce((a, b) => a + b, 0);
    }

    private findDistances = (bases: T[], e: T) => {
        return bases.map((m) => this.DistanceFn(m, e));
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
