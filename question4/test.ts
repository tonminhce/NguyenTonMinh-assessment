import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./question";

function testSumFunctions() {
  const testCases = [1, 5, 10, 100, 1000];

  testCases.forEach((n) => {
    const expected = (n * (n + 1)) / 2;

    console.log(`Testing sum_to_n_a with n = ${n}`);
    const resultA = sum_to_n_a(n);
    console.assert(
      resultA === expected,
      `sum_to_n_a failed for n=${n}: expected ${expected}, got ${resultA}`
    );

    console.log(`Testing sum_to_n_b with n = ${n}`);
    const resultB = sum_to_n_b(n);
    console.assert(
      resultB === expected,
      `sum_to_n_b failed for n=${n}: expected ${expected}, got ${resultB}`
    );

    console.log(`Testing sum_to_n_c with n = ${n}`);
    const resultC = sum_to_n_c(n);
    console.assert(
      resultC === expected,
      `sum_to_n_c failed for n=${n}: expected ${expected}, got ${resultC}`
    );
  });

  console.log("All tests passed!");
}

testSumFunctions();
