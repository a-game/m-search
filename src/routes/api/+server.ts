import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url: { searchParams } }) => {
	const query = searchParams.get('q');
	if (!query) return json([]);

	const limit = searchParams.get('limit');
	const size = Number.isInteger(limit) ? Number(limit) : 5;

	try {
		const { search } = await import('$lib/search');
		const { total, hits } = await search(query, { size, highlight: true });

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = hits.map(({ _id, highlight, _source }: any) => ({
			id: _id,
			title: highlight?.title?.[0] ?? _source.title,
			overview: highlight?.overview?.[0] ?? _source.overview
		}));

		console.log(`Found ${total.value} hits for "${query}"`);

		return json(result);
	} catch (error) {
		console.error(error);
		return json([]);
	}
};
