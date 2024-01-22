import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const url = 'https://api.movies.dcts.se/rpc/movies_search';

type Movie = {
	id: string;
	title: string;
	overview: string;
	poster: string;
	runtime: number;
	popularity: number;
	genres: string[];
	released: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toMovie = (m: any): Movie => ({
	...m,
	released: new Date(m.released).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
});

export const load: PageServerLoad = async ({ fetch, url: { searchParams } }) => {
	const q = searchParams.get('q');
	if (!q) throw redirect(303, '/');

	const res = await fetch(`${url}?q=${q}`);
	const results = (await res.json()) as Movie[];

	if (results.length === 0) return { results: [] };
	return { results: results.map(toMovie) };
};
