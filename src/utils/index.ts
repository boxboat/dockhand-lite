export function randBetween(lower: number, upper: number) {
  return Math.floor(Math.random() * upper) + lower
}

export function sleepAsync(milliseconds: number) {
  return new Promise(r => setTimeout(r, milliseconds))
}
