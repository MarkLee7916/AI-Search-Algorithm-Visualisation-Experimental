export const AVERAGE_OF_VW_AND_VH =
  window.innerHeight + window.innerWidth / 200;

export function randomIntBetween(lower: number, upper: number): number {
  return Math.floor(Math.random() * (upper - lower)) + lower;
}

export function arrayOfRandomIntsBetween(
  lower: number,
  upper: number,
  size: number
): number[] {
  return Array(size)
    .fill(undefined)
    .map(() => randomIntBetween(lower, upper));
}

export function isOdd(num: number): boolean {
  return num % 2 === 0;
}

export function wait(delay: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export function filterStr(
  str: string,
  predicate: (char: string) => boolean
): string {
  return Array.from(str).filter(predicate).join('');
}

export function isCharNumeric(char: string): boolean {
  return !isNaN(parseInt(char, 10));
}

export function getValueFromRangeEvent(event: Event): number {
  const rangeElement = event.target as HTMLInputElement;
  const value = parseInt(rangeElement.value, 10);

  return value;
}

export function assertDefined<T>(item: T | undefined): T {
  if (item === undefined) {
    throw new Error('Argument is undefined!');
  } else {
    return item;
  }
}

export function assertNonNull<T>(item: T | null): T {
  if (item === null) {
    throw new Error('Argument is null!');
  } else {
    return item;
  }
}

export function sumNumArray(numArray: number[]): number {
  return numArray.reduce((total, num) => total + num, 0);
}

export function sequenceBetween(lower: number, upper: number): number[] {
  const sequence = [];

  for (let item = lower; item < upper; item++) {
    sequence.push(item);
  }

  return sequence;
}

export function removeItemFromArray<T>(array: T[], item: T): void {
  const index = array.indexOf(item);

  if (index !== -1) {
    array.splice(index, 1);
  }
}

export function initGenericArray<T>(length: number, computeItem: () => T): T[] {
  return initGenericGrid(1, length, computeItem)[0];
}

export function initGenericGrid<T>(
  height: number,
  width: number,
  computeItem: (row: number, col: number) => T
): T[][] {
  const grid: T[][] = [];

  for (let row = 0; row < height; row++) {
    grid.push([]);
    for (let col = 0; col < width; col++) {
      grid[row].push(computeItem(row, col));
    }
  }

  return grid;
}

export function safeGetArrayIndex<T>(array: T[], index: number): number {
  if (index < 0) {
    return 0;
  } else if (index >= array.length) {
    return array.length - 1;
  } else {
    return index;
  }
}

export function areObjectsEqualDisregardingRefs<T>(obj1: T, obj2: T): boolean {
  return Object.values(obj1).every((_, i) => {
    const val1 = Object.values(obj1)[i];
    const val2 = Object.values(obj2)[i];

    return isObjectRef(val1) || isObjectRef(val2) || val1 === val2;
  });
}

function isObjectRef<T>(item: T): boolean {
  return typeof item === 'object' && item !== null;
}
