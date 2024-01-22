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

## Cuts

As always in software development, there are some cuts that had to be made:

- No support for pagination.
- No UI tests using cypress or playwright or the like.
