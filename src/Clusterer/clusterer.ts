import * as errorMessages from "./errorMessages";

export class Clusterer<T> {
    public static clusterElements = <T extends {}>(elements: T[], k: number, distanceFn?: (t1: T, t2: T) => number) => {
        const instance = new Clusterer(elements, k, distanceFn);
        const ret: T[][] = new Array();
        return ret;
    }

    private constructor(
            public elements: T[],
            public k: number,
            public distanceFn?: (t1: T, t2: T) => number) {
        const medoids = this.selectInitialMediods(elements, k);

    }

    private selectInitialMediods = (elements: T[], k: number) => {
        if (k >= elements.length) {
            throw errorMessages.kGtElementArrLength;
        }
        const ret: T[] = [];
        for (let i = 0; i < k; i++) {
            ret.push(elements[i]);
        }
        return ret;
    }
}
