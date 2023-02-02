<template>
	<section class="practiceFeature" :class="$style.practiceFeature">
		<p>{{ title }}</p>
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
