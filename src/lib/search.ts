import { Client } from '@opensearch-project/opensearch';
import { env } from '$env/dynamic/public';
const index = 'movies';

type Options = {
	size?: number;
	highlight?: boolean;
};

function getNode() {
	const node = env.PUBLIC_OPEN_SEARCH_URL;
	if (!node) {
		throw new Error('PUBLIC_OPEN_SEARCH_URL is not defined in .env');
	}
	return node;
}

export async function search(query: string, { size = 5, highlight = false }: Options = {}) {
	const node = getNode();
	const client = new Client({ node });

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
	const node = getNode();
	const client = new Client({ node });

	const { body } = await client.get({ index, id });

	return body._source;
}
