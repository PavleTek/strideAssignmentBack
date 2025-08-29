describe('Simple API Test', () => {
  test('should always pass', () => {
    expect(true).toBe(true);
  });

  test('basic math works', () => {
    expect(2 + 2).toBe(4);
  });

  test('string operations work', () => {
    expect('hello' + ' world').toBe('hello world');
  });

  test('array operations work', () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
  });
});
