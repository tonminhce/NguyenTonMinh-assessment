"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sum_to_n_a = sum_to_n_a;
exports.sum_to_n_b = sum_to_n_b;
exports.sum_to_n_c = sum_to_n_c;
function sum_to_n_a(n) {
    var sum = 0;
    for (var x = 1; x <= n; x++) {
        sum = sum + x;
    }
    return sum;
}
function sum_to_n_b(n) {
    return (n * (n + 1)) / 2;
}
function sum_to_n_c(n) {
    if (n % 2 === 0) {
        return (n / 2) * (n + 1);
    }
    else {
        return ((n + 1) / 2) * n;
    }
}
