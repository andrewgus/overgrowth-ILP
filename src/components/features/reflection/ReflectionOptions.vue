<template>
	<FinaleReflectionsReveal v-if="isFinaleReveal" :prompt="prompt" />
	<ReflectionInput v-else :prompt="prompt" :id="id">
		<slot></slot>
	</ReflectionInput>
</template>

<script setup lang="ts">
	import ReflectionInput from './ReflectionInput.vue'
	import FinaleReflectionsReveal from './FinaleReflectionsReveal.vue'

	interface props {
		id: string
		prompt: string
		isFinaleReveal: boolean
	}
	const props = defineProps<props>()
</script>
