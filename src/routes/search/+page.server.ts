import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Movie } from '$lib/types';
import { PUBLIC_USE_OPEN_SEARCH } from '$env/static/public';

const url = 'https://api.movies.dcts.se/rpc/movies_search';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toMovie = (m: any): Movie => ({
	...m,
	released: new Date(m.released).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
});

const doSearch = async (
	query: string,
	fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>
): Promise<{ results: Movie[]; total: number }> => {
	const size = 20;

	if (PUBLIC_USE_OPEN_SEARCH === 'true') {
		const { search } = await import('$lib/search');
		const { total, hits } = await search(query, { size });

		return {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			results: hits.map(({ _source }: any) => toMovie(_source)),
			total: total.value
		};
	}

	const res = await fetch(`${url}?q=${query}&limit=${size}`);
	const results = (await res.json()) as Movie[];
	console.log('Found', results.length, 'results for', query);

	return {
		results: results.map(toMovie),
		total: Number.NaN
	};
};

export const load: PageServerLoad = async ({ fetch, url: { searchParams } }) => {
	const q = searchParams.get('q');
	if (!q) throw redirect(303, '/');

	try {
		const { results, total } = await doSearch(q, fetch);
		return { results, total };
	} catch (error) {
		console.error(error);
		return { results: [], total: Number.NaN };
	}
};
