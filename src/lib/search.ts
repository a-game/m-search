import { Client } from '@opensearch-project/opensearch';
import { PUBLIC_OPEN_SEARCH_URL } from '$env/static/public';
const index = 'movies';

type Options = {
	size?: number;
	highlight?: boolean;
};
export async function search(query: string, { size = 5, highlight = false }: Options = {}) {
	const client = new Client({
		node: PUBLIC_OPEN_SEARCH_URL
	});

	const body: Record<string, unknown> = {
		query: {
			multi_match: {
				query,
				fields: ['title', 'overview']
			}
		}
	};
	if (highlight) {
		body.highlight = {
			fields: {
				title: {},
				overview: {}
			}
		};
	}

	const result = await client.search({ index, size, body });

	return result.body.hits;
}

export async function get(id: string) {
	const client = new Client({
		node: PUBLIC_OPEN_SEARCH_URL
	});

	const { body } = await client.get({ index, id });

	return body._source;
}
