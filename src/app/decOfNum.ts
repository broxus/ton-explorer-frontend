export function decOfNum(n: number, one: string = '1', two: string = '2', five: string = '5') {
  const cases = [2, 0, 1, 1, 1, 2];
  const titles = [one, two, five];
  return titles[ (n % 100 > 4 && n % 100 < 20) ? 2 : cases[(n % 10 < 5) ? n % 10 : 5] ];
}
