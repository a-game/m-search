import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should run a function', async () => {
    // given
    vi.useRealTimers();
    const fn = vi.fn().mockResolvedValueOnce('foo');

    // when
    const debounced = debounce(fn, 0);
    const val = await debounced();

    // then
    expect(debounced).toBeInstanceOf(Function);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(val).toBe('foo');
  });

  it('should execute just once', () => {
    // given
    vi.useFakeTimers();
    const fn = vi.fn().mockResolvedValueOnce('foo');
    const debounced = debounce(fn);

    for (let i = 0; i < 100; i++) {
      debounced();
    }

    // Fast-forward time
    vi.runAllTimers();

    expect(fn).toBeCalledTimes(1);
  });

  it('should execute after the specified time', () => {
    // given
    vi.useFakeTimers();
    const fn = vi.fn().mockResolvedValueOnce('foo');
    const debounced = debounce(fn, 100);

    debounced();
    expect(fn).not.toBeCalled();

    // Fast-forward time
    vi.runAllTimers();

    expect(fn).toBeCalled();
  });

  it('should throw an error if the function throws', async () => {
    // given
    vi.useFakeTimers();
    const fn = vi.fn().mockRejectedValueOnce(new Error('foo'));
    const debounced = debounce(fn);

    // when
    const promise = debounced();

    // Fast-forward time
    vi.runAllTimers();

    // then
    await expect(promise).rejects.toThrow('foo');
  });
});
