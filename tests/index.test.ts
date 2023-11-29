import { helloWorld } from '../src/index';

describe('Index Tests', () => {
  test('sum function adds numbers correctly', () => {
    expect(helloWorld()).toBe('Hello, TypeScript ESM world!');
  });
});