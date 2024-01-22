/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi } from 'vitest';
import { load } from './+page.server';
import * as s from '$lib/search';

describe('Results page', () => {
	vi.mock('$env/static/public', () => {
		return {
			PUBLIC_USE_OPEN_SEARCH: 'true'
		};
	});
	it('Should throw if no query is provided', async () => {
		// given
		const query = '';
		const evt = {
			url: { searchParams: { get: () => query } },
			fetch: vi.fn()
		} as any;

		// when
		const promise = load(evt);

		// then
		await expect(promise).rejects.toThrow();
	});

	it('Should return the first 20 hits', async () => {
		// given
		const query = 'test';
		const evt = {
			url: { searchParams: { get: () => query } },
			fetch: vi.fn()
		} as any;

		const mkSearch = vi.spyOn(s, 'search').mockResolvedValueOnce({ total: { value: 10 }, hits: [] });

		// when
		const res = await load(evt);

		// then
		expect(mkSearch).toHaveBeenCalledWith(query, { size: 20 });
    expect(res).toEqual({ results: [], total: 10 });
	});

  it('should return empty results if the search fails', async () => {
    // given
    const query = 'test';
    const evt = {
      url: { searchParams: { get: () => query } },
      fetch: vi.fn()
    } as any;

    vi.spyOn(s, 'search').mockRejectedValueOnce(new Error('test error'));

    // when
    const res = await load(evt);

    // then
    expect(res).toEqual({ results: [], total: Number.NaN });
  });
});
