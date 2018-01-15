import * as errorMessages from "./errorMessages";

export class Clusterer {

    public clusterElements = <T extends {}>(elements: T[], k: number, distanceFn?: (t1: T, t2: T) => number) => {
        const medoids = this.selectInitialMediods(elements, k);
        const ret: T[][] = new Array();
        return ret;
    }

    private selectInitialMediods = <T extends {}>(elements: T[], k: number) => {
        throw errorMessages.kGtElementArrLength;
    }
}
