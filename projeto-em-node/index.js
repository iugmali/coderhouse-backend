const totals = {}

function generateRandomNumber() {
  return Math.floor(Math.random() * 20) + 1;
}
for (let i = 0; i < 10_000; i++) {
  const num = generateRandomNumber();
  totals[num] = (totals[num] ?? 0) + 1;
}

console.log(totals)
