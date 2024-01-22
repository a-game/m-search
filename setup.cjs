/* eslint-disable @typescript-eslint/no-var-requires */
const { Client } = require('@opensearch-project/opensearch');
require('dotenv').config();

async function setup() {
	const node = process.env.PUBLIC_OPEN_SEARCH_URL;
	if (!node) {
		console.error('PUBLIC_OPEN_SEARCH_URL is not defined in .env. Please define it and try again.');
		return;
	}

	const index = 'movies';
	const client = new Client({ node });

	console.log('Creating index...');
	const { statusCode } = await client.indices.create({
		index,
		body: {
			settings: {
				analysis: {
					analyzer: {
						autocomplete: {
							tokenizer: 'autocomplete',
							filter: ['lowercase']
						},
						autocomplete_search: {
							tokenizer: 'lowercase'
						}
					},
					tokenizer: {
						autocomplete: {
							type: 'edge_ngram',
							min_gram: 1,
							max_gram: 20,
							token_chars: ['letter', 'digit']
						}
					}
				}
			},
			mappings: {
				properties: {
					title: {
						type: 'text',
						analyzer: 'autocomplete',
						search_analyzer: 'autocomplete_search',
						boost: 2,
						fields: {
							keyword: {
								type: 'keyword'
							}
						}
					},
					overview: {
						type: 'text',
						analyzer: 'autocomplete',
						search_analyzer: 'autocomplete_search',
						boost: 1
					}
				}
			}
		}
	});
	console.log('Create index status: ', statusCode);

	console.log('Reading data files...');
	const data = [];
	for (let i = 0; i < 25; i++) {
		data.push(...require(`./data/m${i}.json`));
	}

	console.log(`Indexing ${data.length} documents...`);
	const result = await client.helpers.bulk({
		datasource: data,
		onDocument: (doc) => ({ index: { _index: index, _id: doc.id } })
	});

	console.log('Indexing status: ', result);
}

setup();
