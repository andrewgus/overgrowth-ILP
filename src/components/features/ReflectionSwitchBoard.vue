<template>
	<component :is="reflectionFeature" v-bind="conditionalProps">
		<slot></slot>
	</component>
</template>

<script setup lang="ts">
	import { defineAsyncComponent, computed } from 'vue'

	interface props {
		id: string
		prompt: string
		isFinaleReveal: boolean
	}
	const props = defineProps<props>()

	const reflectionFeature = defineAsyncComponent(
		() =>
			import(
				`./reflectionOptions/${
					props.isFinaleReveal ? 'FinaleReflectionsReveal' : 'ReflectionInput'
				}.vue`
			)
	)
	const conditionalProps = computed(() => {
		return props.isFinaleReveal
			? { prompt: props.prompt }
			: { id: props.id, prompt: props.prompt }
	})
</script>
