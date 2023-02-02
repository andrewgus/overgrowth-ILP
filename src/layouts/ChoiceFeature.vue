<template>
	<section class="choiceFeature" :class="$style.choiceFeature">
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
	.choiceFeature {
		color: var(--black);
	}
</style>
