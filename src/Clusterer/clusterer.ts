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
        this.IterationCount++;
        if (!this.Clusters) {
            this.allocateToClustersAroundCurrentMedoids();
        }
        const medoidsB4Iter = this.Medoids;
        const clustersB4Iter = this.Clusters;
        const costBeforeIteration = this.calculateCurrentCost();

        let bestCostSoFar  = costBeforeIteration;

        for (let i = 0; i < this.Medoids.length; i++) {
            const isNonMedoid = (e: T) =>
                this.Medoids.filter((m: T) => this.DistanceFn(e, m) === 0 ).length === 0;

            for (const nonMedoidElement of this.Elements.filter(isNonMedoid)) {
                const proposedMedoids = this.Medoids.slice();
                proposedMedoids[i] = nonMedoidElement;
                const tmpClusterer = new Clusterer(this.Elements.slice(), this.K, this.DistanceFn);
                tmpClusterer.Medoids = proposedMedoids;
                tmpClusterer.allocateToClustersAroundCurrentMedoids();
                const costForThisConfiguration = tmpClusterer.calculateCurrentCost();
                if (costForThisConfiguration < bestCostSoFar) {
                    bestCostSoFar = costForThisConfiguration;
                    this.Clusters = tmpClusterer.Clusters;
                    this.Medoids = proposedMedoids;
                }
            }
        }

        const newCost = this.calculateCurrentCost();

        if (newCost < costBeforeIteration) {
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
        const isDistinctFromGroup = (element: T, group: T[]) => {

            for (const grpElem of group) {
                if (this.DistanceFn(grpElem, element) === 0) {
                    return false;
                }
            }
            return true;
        };
        let i = 0;
        while (i < this.Elements.length && ret.length < this.K) {
            if (isDistinctFromGroup(this.Elements[i], ret)) {
                ret.push(this.Elements[i]);
            }
            i++;
        }
        return ret;
    }
}
