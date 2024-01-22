<script lang="ts">
	import Empty from '$lib/components/empty.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import MovieCard from '$lib/components/movie-card.svelte';

	export let data;
	let { results, total } = data;
	$: ({ results, total } = data);
</script>

<main class="container h-full grow pt-8">
	<header class="mb-8 flex items-center justify-between">
		<span class="flex items-center gap-2">
			<Button variant="ghost" size="icon" href="/">
				<ArrowLeft class="size-5" />
				<span class="sr-only">Back</span>
			</Button>
			<h2 class="text-2xl font-bold">Search Results</h2>
		</span>
		<span class="text-sm text-muted-foreground">
			{#if !Number.isNaN(total)}
				Showing {results.length} of {total} results
			{/if}
		</span>
	</header>
	{#if results.length === 0}
		<Empty class="col-span-2 text-muted-foreground" title="No results found" />
	{/if}

	<div class="grid h-full grid-cols-1 gap-8 lg:grid-cols-2">
		{#each results as movie (movie.id)}
			<MovieCard {movie} />
		{/each}
	</div>
</main>
