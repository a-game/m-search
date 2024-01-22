<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import type { Movie } from '$lib/types';
	import { Timer } from 'lucide-svelte';

	export let movie: Movie;
</script>

<Card.Root class="flex flex-col">
	<Card.Header>
		<Card.Title tag="h3">{movie.title}</Card.Title>
		<Card.Description class="flex justify-between">
			<ul class="flex gap-2">
				{#each movie.genres as genre}
					<li>
						<Badge variant="secondary">{genre}</Badge>
					</li>
				{/each}
			</ul>
			<span class="inline-flex items-center gap-1">
				<Timer class="size-4" />
				<span>{movie.runtime} min</span>
			</span>
		</Card.Description>
	</Card.Header>
	<Card.Content class="grid grow grid-cols-[1fr_3fr] gap-4">
		<img src={movie.poster} alt={movie.title} class="rounded" />
		<div class="flex flex-col justify-between gap-2">
			<p>{movie.overview}</p>
			<p class="mt-auto self-end text-sm text-muted-foreground">
				Released on {movie.released}
			</p>
		</div>
	</Card.Content>
</Card.Root>
