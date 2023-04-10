<template>
	<!-- NOTE: id and prompt both needed for possible labels -->
	<p>{{ prompt }}</p>
	<slot></slot>
</template>

<script setup lang="ts">
	interface props {
		id: string
		prompt: string
	}
	const props = defineProps<props>()
</script>
