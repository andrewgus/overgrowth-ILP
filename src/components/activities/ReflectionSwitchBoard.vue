<template>
	<component :is="reflectionActivity" :id="id" :prompt="prompt">
		<slot></slot>
	</component>
</template>

<script setup lang="ts">
	import { defineAsyncComponent } from 'vue'

	type Props = {
		id: string
		prompt: string
		isReflectionFinaleReveal: boolean
	}
	const props = defineProps<Props>()

	const reflectionActivity = defineAsyncComponent(
		() =>
			import(
				`./reflectionOptions/${
					props.isReflectionFinaleReveal ? 'FinaleReflectionsReveal' : 'ReflectionInput'
				}.vue`
			)
	)
</script>
