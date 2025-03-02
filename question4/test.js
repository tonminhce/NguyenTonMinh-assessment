"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var question_1 = require("./question");
function testSumFunctions() {
    var testCases = [1, 5, 10, 100, 1000];
    testCases.forEach(function (n) {
        var expected = (n * (n + 1)) / 2;
        console.log("Testing sum_to_n_a with n = ".concat(n));
        var resultA = (0, question_1.sum_to_n_a)(n);
        console.assert(resultA === expected, "sum_to_n_a failed for n=".concat(n, ": expected ").concat(expected, ", got ").concat(resultA));
        console.log("Testing sum_to_n_b with n = ".concat(n));
        var resultB = (0, question_1.sum_to_n_b)(n);
        console.assert(resultB === expected, "sum_to_n_b failed for n=".concat(n, ": expected ").concat(expected, ", got ").concat(resultB));
        console.log("Testing sum_to_n_c with n = ".concat(n));
        var resultC = (0, question_1.sum_to_n_c)(n);
        console.assert(resultC === expected, "sum_to_n_c failed for n=".concat(n, ": expected ").concat(expected, ", got ").concat(resultC));
    });
    console.log("All tests passed!");
}
testSumFunctions();
