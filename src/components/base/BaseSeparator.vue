<template>
	<div
		:class="$style.separator"
		role="separator"
		:aria-orientation="orientation"
		:aria-hidden="hidden"
	></div>
</template>

<script setup lang="ts">
	interface props {
		orientation: 'horizontal' | 'vertical'
		hidden?: boolean
	}
	defineProps<props>()
</script>

<style module>
	.separator {
		border: 1.25px solid var(--lightGray);
		border-radius: var(--s10);
	}
</style>
