/* eslint-disable @typescript-eslint/no-var-requires */
const { Client } = require('@opensearch-project/opensearch');
require('dotenv').config();

const data = [];
for (let i = 0; i < 25; i++) {
	data.push(...require(`./data/m${i}.json`));
}

console.log('data: ', data.length);

async function setup() {
	const index = 'movies';
	const client = new Client({
		node: 'http://localhost:9200'
	});
	console.log('Creating index...');
	const ir = await client.indices.create({
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
	console.log('Create index status: ', ir.statusCode);

	console.log('indexing data...');
	const br = await client.helpers.bulk({
		datasource: data,
		onDocument: () => ({ index: { _index: index } })
	});

	console.log('Indexing status: ', br);
}

setup();
