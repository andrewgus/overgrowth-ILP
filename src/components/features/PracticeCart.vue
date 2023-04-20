<template>
	<!-- NOTE: id and prompt both needed for possible labels -->
	<p>{{ prompt }}</p>
	<slot></slot>
</template>

<script setup lang="ts">
	import { featureProgressStore } from '../../store/featureOptionsStore'
	interface props {
		id: string
		prompt: string
	}
	const props = defineProps<props>()

	// FOR TESTING. This below would actually exist within a given child component. See reflection for example.
	featureProgressStore[props.id].attemptsFinished = true
</script>
