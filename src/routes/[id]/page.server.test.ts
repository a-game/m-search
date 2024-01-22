/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi } from 'vitest';
import { load } from './+page.server';
import * as s from '$lib/search';

describe('Movie page', () => {
	it('should load the movie', async () => {
		// given
		const someMovie = {
			_id: '1',
			title: 'title',
			overview: 'overview'
		};
		const mkGet = vi.spyOn(s, 'get').mockResolvedValueOnce(someMovie);
		const id = '1';
		const evt = { params: { id } } as any;

		// when
		const res = await load(evt);

		// then
		expect(mkGet).toHaveBeenCalledWith(id);
		expect(res.movie).toEqual(someMovie);
	});

	it('should throw a 404 if the movie is not found', async () => {
		// given
		vi.spyOn(s, 'get').mockRejectedValueOnce(new Error('not found'));
		const id = '1';
		const evt = { params: { id } } as any;

		// when
		const promise = load(evt);

		// then
		await expect(promise).rejects.toThrow();
	});
});
