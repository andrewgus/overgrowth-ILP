<template>
	<header :class="$style.landing">
		<TheScene :scene="scene" />
		<TheTitleCard :title="title" />
		<BaseIndicator isOnLanding hidden text="Scroll to start" />
	</header>
</template>

<script setup lang="ts">
	import { computed, onBeforeMount } from 'vue'
	import TheScene from '../components/landing/TheScene.vue'
	import TheTitleCard from '../components/landing/TheTitleCard.vue'
	import BaseIndicator from '../components/base/BaseIndicator.vue'
	import { featureSettings } from '../store'

	export interface Props {
		title: string
		scene: string
		color?: string
		isReflectionOn?: boolean
		isPracticeOn?: boolean
		isChoiceOn?: boolean
	}
	const props = defineProps<Props>()

	onBeforeMount(() => {
		if (props.isReflectionOn) featureSettings.isReflectionOn.set(true)
		if (props.isPracticeOn) featureSettings.isPracticeOn.set(true)
		if (props.isChoiceOn) featureSettings.isChoiceOn.set(true)
	})

	const bgGradient = computed(() => {
		return `linear-gradient(to bottom, white 0%, ${props.color} 40%, ${props.color} 60%, white 100%);`
	})
</script>

<style module>
	.landing {
		background-image: v-bind(bgGradient);
		min-height: 99vh;
		width: 100vw;
		display: grid;
		grid-template-columns: [landing-top] 1fr [landing-bottom];
		grid-template-rows: [card-start] 4fr [card-indicator] 20vh [indicator-end];
	}
</style>
