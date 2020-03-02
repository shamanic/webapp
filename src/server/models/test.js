'use strict';
let count = 0;
const counter = {
    count: 0,
    increase() {
        setInterval(function () {
            console.log(++this.count);
        }, 1000);
    },
};

const arrow_counter = {
    count: 0,
    increase() {
        setInterval(() => {
            console.log(++this.count);
        }, 1000);
    },
}

console.log('starting tests:');
counter.increase();
arrow_counter.increase();