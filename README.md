# Readme

m-search is a simple web site that allows you to search for your favorite movies :)

## Tech stack

- Sveltekit for bundling, routing, SSR and api.
- shadcn-svelte for ui components (everything in `$lib/components/ui`).
- Tailwindcss for styling.

## Runing against the movie api

All you need to do is `npm install` and `npm start` and you are good to go.

The movie api has some minor limitations:

- It only returns movie titles on autocomplete
- It doesn't tell you the total number of hits.
- It's missing highlights on the search results.
- The `autocomplete` endpoint and the `search` endpoints don't rank the results the same way. (e.g. Search for "foo")

## Running against a local OpenSearch (Elasticsearch)

We can resolve the above limitations by running our own search engine. I chose to use OpenSearch (Elasticsearch) because it's open source and it's easy to setup using docker.

In order to run against a local OpenSearch instance, you need to do the following:

1. Run the OpenSearch instance using docker `docker compose up -d`
2. Index some movies using `node setup.cjs`
3. Create a `.env` file in the root of the project with the following variable:

```.env
PUBLIC_USE_LOCAL_API=true
PUBLIC_OPEN_SEARCH_URL=http://localhost:9200
```

4. Run `npm start`

## Cuts

As always in software development, there are some cuts that had to be made:

- No support for pagination.
- No UI tests using cypress or playwright or the like.
- Local search engine is limited to 25k documents.
