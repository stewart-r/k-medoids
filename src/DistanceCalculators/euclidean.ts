export const distance = (a: any, b: any) => {
    if (a.length !== b.length) {
        throw new Error("the inputs must have the same dimension");
    }
    const sumOfSqrsOfDistances = Array.from(a.keys())
        .map((i: number) => {
            return Math.pow(Math.abs(a[i] - b[i]), 2);
        })
        .reduce((j, k ) => j + k, 0);
    return Math.sqrt(sumOfSqrsOfDistances);
};
