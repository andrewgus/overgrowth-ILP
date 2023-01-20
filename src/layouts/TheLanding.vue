<template>
	<header :style="{ backgroundImage: `${bgGradient}` }">
		<TheScene
			:scene="scene"
			:isReflectionOn="isReflectionOn"
			:isPracticeOn="isPracticeOn"
			:isChoiceOn="isChoiceOn"
		/>
		<TheTitleCard
			:title="title"
			:isReflectionOn="isReflectionOn"
			:isPracticeOn="isPracticeOn"
			:isChoiceOn="isChoiceOn"
		/>
		<TheIndicator />
	</header>
</template>

<script setup lang="ts">
	import { computed, withDefaults } from 'vue'

	import TheScene from '../components/Landing/TheScene.vue'
	import TheTitleCard from '../components/Landing/TheTitleCard.vue'
	import TheIndicator from '../components/Landing/TheIndicator.vue'

	interface Props {
		title: string
		scene: string
		color?: string
		isReflectionOn?: boolean
		isPracticeOn?: boolean
		isChoiceOn?: boolean
	}

	const props = withDefaults(defineProps<Props>(), {
		color: 'white',
	})

	const bgGradient = computed(() => {
		return `linear-gradient(180deg, white 0%, ${props.color} 50%, white 100%);`
	})
</script>

<style scoped>
	header {
		min-height: 99vh;
		width: 100vw;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
	}
</style>
