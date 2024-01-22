/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi } from 'vitest';
import { GET } from './+server';
import * as s from '$lib/search';

describe('search endpoint', () => {
	it('Should return an empty array if no query is provided', async () => {
		// given
		const query = '';
		const evt = { url: { searchParams: { get: () => query } } } as any;

		// when
		const res = await GET(evt);
		const json = await res.json();

		// then
		expect(json).toEqual([]);
	});

	it('should search for the query', async () => {
		// given
		const mkSearch = vi.spyOn(s, 'search').mockResolvedValueOnce({ total: { value: 0 }, hits: [] });
		const query = 'test';
		const evt = { url: { searchParams: { get: () => query } } } as any;

		// when
		await GET(evt);

		// then
		expect(mkSearch).toHaveBeenCalledWith(query, expect.anything());
	});

	it('Should prefer highlight over source, but fallback on source when highlight is missing', async () => {
		// given
		vi.spyOn(s, 'search').mockResolvedValueOnce({
			total: { value: 1 },
			hits: [
				{
					_id: '1',
					highlight: {
						title: ['highlighted title']
					},
					_source: {
						title: 'source title',
						overview: 'source overview'
					}
				}
			]
		});
		const query = 'test';
		const evt = { url: { searchParams: { get: () => query } } } as any;

		// when
		const res = await GET(evt);
		const json = await res.json();

		// then
		expect(json).toEqual([
			{
				id: '1',
				title: 'highlighted title',
				overview: 'source overview'
			}
		]);
	});

	it('Should return an empty array if search fails', async () => {
		// given
		vi.spyOn(s, 'search').mockRejectedValueOnce(new Error('test'));
		const query = 'test';
		const evt = { url: { searchParams: { get: () => query } } } as any;

		// when
		const res = await GET(evt);
		const json = await res.json();

		// then
		expect(json).toEqual([]);
	});
});
