<template>
	<div role="separator" :aria-hidden="hidden" aria-orientation="vertical"></div>
</template>

<script setup lang="ts">
	defineProps({
		hidden: {
			type: Boolean,
		},
	})
</script>

<style scoped>
	div {
		border: 1.25px solid var(--lightGray);
		border-radius: var(--s10);
	}
</style>
