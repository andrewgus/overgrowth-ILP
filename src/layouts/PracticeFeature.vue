<template>
	<section class="feature" :class="$style.practiceFeature">
		<h2>{{ title }}</h2>
	</section>
</template>

<script setup lang="ts">
	defineProps({
		title: {
			type: String,
			required: true,
		},
	})
</script>

<style module lang="scss">
	.practiceFeature {
		color: var(--black);
	}
</style>
