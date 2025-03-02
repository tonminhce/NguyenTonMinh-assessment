function sum_to_n_a(n: number): number {
  let sum = 0;
  for (let x = 1; x <= n; x++) {
    sum = sum + x;
  }
  return sum;
}

function sum_to_n_b(n: number): number {
  return (n * (n + 1)) / 2;
}

function sum_to_n_c(n: number): number {
  if (n % 2 === 0) {
    return (n / 2) * (n + 1);
  } else {
    return ((n + 1) / 2) * n;
  }
}

export { sum_to_n_a, sum_to_n_b, sum_to_n_c };
