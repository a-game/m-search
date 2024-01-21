<script>
	import '../app.pcss';
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button';
	import { Sun, Moon } from 'lucide-svelte';
	import { cn } from '$lib/utils';
</script>

<ModeWatcher />

<header
	class={cn(
		'sticky top-0 z-50 w-full',
		'border-b border-border',
		'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
	)}
>
	<div class="container flex h-16 items-center gap-6">
		<h1>m-search</h1>
		<div class="ml-auto">
			<Button on:click={toggleMode} variant="outline" size="icon">
				<Sun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</div>
</header>

<slot />
