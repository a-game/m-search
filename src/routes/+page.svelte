<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { debounce } from '$lib/debounce';
	import { cn } from '$lib/utils';
	import { Search, X, Loader2 } from 'lucide-svelte';
	import { env } from '$env/dynamic/public';

	type Hit = {
		id: string;
		title: string;
		overview: string;
	};

	let query = '';
	let result: (string | Hit)[] = [];
	let loading = false;

	$: url = env.PUBLIC_OPEN_SEARCH_URL
		? '/api'
		: 'https://api.movies.dcts.se/rpc/movies_autocomplete';
	const limit = 5;
	const debouncedFetch = debounce((q: string) =>
		fetch(`${url}?limit=${limit}&q=${q}`).then((res) => res.json())
	);

	const autocomplete = async (evt: KeyboardEvent) => {
		if (query.trim().length === 0) {
			result = [];
			return;
		}

		const isSearchableChar = /^[a-zA-Z0-9-_ ]$/i.test(evt.key);
		if (!isSearchableChar && evt.key !== 'Backspace') return;

		loading = true;
		result = await debouncedFetch(query);
		loading = false;
	};

	function clear() {
		query = '';
	}
</script>

<main class="container h-full grow pt-16">
	<div class="m-auto flex max-w-xl flex-col gap-2">
		<form class="m-auto flex w-full max-w-xl items-center space-x-2" action="/search">
			<div class="relative grow">
				<Input
					autocomplete="off"
					class="pr-10"
					name="q"
					placeholder="Start typing to search for movies"
					bind:value={query}
					on:keyup={autocomplete}
				/>
				<Button
					disabled={loading}
					size="icon"
					variant="ghost"
					class={cn(
						'absolute right-1 top-1 size-fit rounded-full p-2 opacity-0 transition-opacity',
						query && 'opacity-95'
					)}
					on:click={clear}
				>
					{#if loading}<Loader2 class="size-4 animate-spin" />
					{:else}<X class="size-4" />{/if}
				</Button>
			</div>
			<Button size="icon" variant="outline" type="submit"><Search class="size-5" /></Button>
		</form>

		{#if result.length > 0}
			<Card>
				<CardContent class="p-0">
					<ul class="result divide-y">
						{#each result as hit}
							<li
								class={cn(
									'p-4',
									typeof hit === 'object' &&
										'cursor-pointer hover:bg-accent hover:text-accent-foreground'
								)}
							>
								{#if typeof hit === 'string'}
									{hit}
								{:else}
									<a href={`/${hit.id}`}>
										<p>{@html hit.title}</p>
										<p class="line-clamp-3 text-sm text-muted-foreground">{@html hit.overview}</p>
									</a>
								{/if}
							</li>
						{/each}
					</ul>
				</CardContent>
			</Card>
		{/if}
	</div>
</main>
