<template>
	<header>
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
		<BaseIndicator isOnLanding hidden text="Scroll to start" />
	</header>
</template>

<script setup lang="ts">
	import { computed, withDefaults } from 'vue'

	import TheScene from '../components/landing/TheScene.vue'
	import TheTitleCard from '../components/landing/TheTitleCard.vue'
	import BaseIndicator from '../components/base/BaseIndicator.vue'

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
		background-image: v-bind(bgGradient);
		min-height: 99vh;
		width: 100vw;
		display: grid;
		grid-template-columns: [landing-top] 1fr [landing-bottom];
		grid-template-rows: [card-start] 4fr [card-indicator] 10vh [indicator-end];
	}
</style>
