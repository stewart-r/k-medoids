export interface IClusterElement<T> {
    DistanceFromMedoid: number;
    Element: T;
}

export interface ICluster<T> {
    Elements: Array<IClusterElement<T>>;
    Medoid: T;
}

export class Cluster<T> implements ICluster<T> {
    public Elements: Array<IClusterElement<T>>;
    public Medoid: T;

    constructor(cluster: ICluster<T>) {
        this.Elements = cluster.Elements;
        this.Medoid = cluster.Medoid;
    }

    public getCost = () => {
        return this.Elements.map((e) => e.DistanceFromMedoid).reduce((a, b) => a + b, 0);
    }

    public findBestMedoidIdx = (distanceFn: (t1: T, t2: T) => number) => {
        const mapToCost = (e: IClusterElement<T>) => this.calcCostForGivenElementAsMedoid(e, distanceFn);
        const candidateNewMedoids = this.Elements
            .map(mapToCost);

        return candidateNewMedoids
            .reduce((iMin, e, idx, arr) => e.CostIfMadeMedoid < arr[iMin].CostIfMadeMedoid ? idx : iMin, 0);
    }

    private calcCostForGivenElementAsMedoid =
        (proposedMedoid: IClusterElement<T>, distanceFn: (t1: T, t2: T) => number) => {
            const clusterWithThisAsMedoid = new Cluster({
                Elements: this.Elements.map((elem) => {
                        const ret: IClusterElement<T> = {
                            DistanceFromMedoid: distanceFn(elem.Element, proposedMedoid.Element),
                            Element: elem.Element,
                        };
                        return ret;
                    }),
                Medoid: proposedMedoid.Element,
                });
            return {
                CostIfMadeMedoid: clusterWithThisAsMedoid.getCost(),
                Element: proposedMedoid,
            };
    }
}
