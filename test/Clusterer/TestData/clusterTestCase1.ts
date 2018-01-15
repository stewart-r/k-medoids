import { ICluster } from "k-medoids/src/Clusterer/cluster";

export const testCase: Array<ICluster<number[]>> = [
    {
        Elements: [
            {
                DistanceFromMedoid: 0,
                Element: [
                    1,
                    0,
                ],
            },
            {
                DistanceFromMedoid: 3.1622776601683795,
                Element: [
                    0,
                    3,
                ],
            },
            {
                DistanceFromMedoid: 4.47213595499958,
                Element: [
                    -1,
                    4,
                ],
            },
        ],
        Medoid: [
            1,
            0,
        ],
    },
    {
        Elements: [
            {
                DistanceFromMedoid: 0,
                Element: [
                    1.5,
                    0,
                ],
            },
            {
                DistanceFromMedoid: 1.118033988749895,
                Element: [
                    2,
                    1,
                ],
            },
        ],
        Medoid: [
            1.5,
            0,
        ],
    },
];
