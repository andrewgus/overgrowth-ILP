<template>
	<p>{{ prompt }}</p>
</template>

<script setup lang="ts">
	import { activityProgressStore } from '../../../store/activityOptionsStore'
	const props = defineProps({
		id: {
			type: String,
			required: true,
		},
		prompt: {
			type: String,
			required: true,
		},
	})

	// // FOR TESTING. This below would actually exist within a given child component. See reflection for example.
	activityProgressStore[props.id].isAttemptsFinished = true
</script>

<style module lang="scss"></style>
