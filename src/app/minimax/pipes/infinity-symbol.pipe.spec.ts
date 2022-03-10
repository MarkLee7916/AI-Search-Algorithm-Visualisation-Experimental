import { InfinitySymbolPipe } from './infinity-symbol.pipe';

describe('InfinitySymbolPipe', () => {
  const pipe = new InfinitySymbolPipe();

  it('transforms "" to ""', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('transforms "null" to ""', () => {
    expect(pipe.transform('null')).toBe('');
  });

  it('transforms null to ""', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('transforms "Infinity" to ""', () => {
    expect(pipe.transform('Infinity')).toBe('∞');
  });

  it('transforms "xInfinityx" to "xx"', () => {
    expect(pipe.transform('xInfinityx')).toBe('x∞x');
  });

  it('transforms "InfinityInfinity" to "∞∞"', () => {
    expect(pipe.transform('InfinityInfinity')).toBe('∞∞');
  });

  it('transforms "xInfinityxInfinityx" to "x∞x∞x"', () => {
    expect(pipe.transform('xInfinityxInfinityx')).toBe('x∞x∞x');
  });
});
