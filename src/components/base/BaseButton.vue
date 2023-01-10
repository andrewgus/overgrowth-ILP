<template>
	<button v-if="!link">{{ text }}</button>
	<a v-else :href?="{ href }"></a>
</template>

<script setup lang="ts">
	defineProps({
		text: {
			type: String,
			required: true,
		},
		link: {
			type: Boolean,
		},
		href: {
			type: String,
		},
	})
</script>

<style scoped></style>
