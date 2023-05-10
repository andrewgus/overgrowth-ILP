<template>
	<p>{{ prompt }}</p>
	<slot></slot>
</template>

<script setup lang="ts">
	import { activityProgressStore } from '../../store/activityOptionsStore'
	// NOTE: id and prompt both needed for possible labels
	type Props = {
		id: string
		prompt: string
	}
	const props = defineProps<Props>()

	// FOR TESTING. This below would actually exist within a given child component. See reflection for example.
	activityProgressStore[props.id].isAttemptsFinished = true
</script>
