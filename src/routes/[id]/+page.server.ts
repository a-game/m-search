import type { Movie } from '$lib/types';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	try {
		const { get } = await import('$lib/search');
		const movie = (await get(id)) as Movie;

		return { movie };
	} catch (e) {
		console.error(e);
		throw error(404, 'Movie not found');
	}
};
