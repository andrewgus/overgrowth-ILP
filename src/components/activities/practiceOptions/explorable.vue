<template>
	<p>{{ prompt }}</p>
</template>

<script setup lang="ts">
	defineProps({
		prompt: {
			type: String,
			required: true,
		},
	})
</script>

<style module lang="scss"></style>
