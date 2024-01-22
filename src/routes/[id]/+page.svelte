<script lang="ts">
	import MovieCard from '$lib/components/movie-card.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';

	export let data;
	let { movie } = data;
	$: ({ movie } = data);
</script>

<main class="container h-full grow pt-8">
	<header class="mb-8 flex items-center gap-2">
		<Button variant="ghost" size="icon" href="/">
			<ArrowLeft class="size-5" />
			<span class="sr-only">Back</span>
		</Button>
		<h2 class="text-2xl font-bold">{movie.title}</h2>
	</header>

	<MovieCard {movie} />
</main>
