[![Build Status](https://travis-ci.org/stewart-r/k-medoids.svg?branch=master)](https://travis-ci.org/stewart-r/k-medoids)

# k-medoids
An implementation of the k-medoid Partitioning Around Medoids (PAM) algorithm ([wikipedia entry](https://en.wikipedia.org/wiki/K-medoids))

## Example Usage

### Simple Example (Uses Euclidean Distance Function by default)

TypeScript:
``` typescript

import { Cluster, Clusterer } from "k-medoids";

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
clusteredData

```

JavaScript:
``` javascript

const kmeds = require("k-medoids");

const k = 2;
const myData = [
    [1, 2],
    [1, 3],
    [-1, 2.5],
    [0, 0],
    [510, 203],
    [-100, 120],
];

const clusterer = kmeds.Clusterer.getInstance(myData, 2);
const clusteredData = clusterer.getClusteredData();
clusteredData

```

outputs:
``` json

[
    [
        [510,203]
    ],
    [
        [1,2],[1,3],[-1,2.5],[0,0],[-100,120]
    ]
]

```

### Using a Custom Distance Function
``` typescript

const myFunkyDistanceFn = (a: number[], b: number[]) => {
    return Math.abs(a[1] - b[1]);
};

const myClusterer = Clusterer.getInstance(myData, 2, myFunkyDistanceFn);
const data = myClusterer.getClusteredData();
data

```
outputs:
``` json
[
    [
        [510,203],
        [-100,120]
    ],
    [
        [1,2],
        [1,3],
        [-1,2.5],
        [0,0]
    ]
]
```

### Clustering custom objects

We can cluster any object type as long as we provide a distance function to give the distance between them.

For example with a set of "widgets" like this:
``` typescript
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
```

we might consider items to be similar by weight, and thus:

``` typescript
const myWidgetClusterer = Clusterer.getInstance(myWidgets, 2, (a, b) => {
    return Math.abs(a.Weight - b.Weight);
});
const groupedWidgets = myWidgetClusterer.getClusteredData();
groupedWidgets
```

gives us:

``` json
[
    [
        {"Name":"Bohemoth","Weight":120},
        {"Name":"Goliath","Weight":125}
    ],
    [
        {"Name":"DoHickey","Weight":10},
        {"Name":"Thingy","Weight":10.5},
        {"Name":"Whatsit","Weight":9.5}]
    ]
]
```

