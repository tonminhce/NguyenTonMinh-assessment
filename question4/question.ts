// Time Complexity: O(n) - The loop runs 'n' times, so the time complexity is linear.
// Space Complexity: O(1) - Only a constant amount of space is used for the 'sum' variable.
function sum_to_n_a(n: number): number {
  let sum = 0;
  for (let x = 1; x <= n; x++) {
    sum = sum + x;
  }
  return sum;
}

// Time Complexity: O(1) - The formula performs a constant number of operations regardless of the value of 'n'.
// Space Complexity: O(1) - Only a constant amount of space is used to store the result.
function sum_to_n_b(n: number): number {
  return (n * (n + 1)) / 2;
}

// Time Complexity: O(1) - The formula performs a constant number of operations, whether 'n' is even or odd.
// Space Complexity: O(1) - Only a constant amount of space is used to calculate the result.
function sum_to_n_c(n: number): number {
  if (n % 2 === 0) {
    return (n / 2) * (n + 1);
  } else {
    return ((n + 1) / 2) * n;
  }
}

export { sum_to_n_a, sum_to_n_b, sum_to_n_c };
