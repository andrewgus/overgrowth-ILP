<template>
	<div
		:class="$style.separator"
		role="separator"
		:aria-hidden="hidden"
		aria-orientation="vertical"
	></div>
</template>

<script setup lang="ts">
	defineProps({
		hidden: {
			type: Boolean,
		},
	})
</script>

<style module>
	.separator {
		border: 1.25px solid var(--lightGray);
		border-radius: var(--s10);
	}
</style>
