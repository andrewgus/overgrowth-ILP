<template>
	<section :class="$style.staticContent">
		<div>
			<h2>{{ title }}</h2>
			<slot />
		</div>
	</section>
</template>

<script setup lang="ts">
	defineProps({
		title: {
			type: String,
		},
	})
</script>

<style module lang="scss">
	.staticContent > div {
		font-size: var(--s0);
		margin: 0 auto;
		max-width: 60ch;
		width: 100%;
	}
	.staticContent > div :slotted(p) {
		max-width: 60ch;
	}
</style>
