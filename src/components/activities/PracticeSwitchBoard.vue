<template>
	<component :is="practiceActivity" v-bind="conditionalProps">
		<slot></slot>
	</component>
</template>

<script setup lang="ts">
	import { computed, defineAsyncComponent } from 'vue'
	import { activityProgressStore } from '../../store/activityOptionsStore'
	// NOTE: id and prompt both needed for possible labels
	type Props = {
		id: string
		prompt: string
		practiceType: string
	}
	const props = defineProps<Props>()

	const practiceActivity = defineAsyncComponent(
		() => import(`./practiceOptions/${props.practiceType}.vue`)
	)
	const conditionalProps = computed(() => {
		return { id: props.id, prompt: props.prompt }
	})

	// FOR TESTING. This below would actually exist within a given child component. See reflection for example.
	activityProgressStore[props.id].isAttemptsFinished = true
</script>
