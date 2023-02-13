<template>
	<header :class="$style.landing">
		<TheScene :scene="scene" />
		<TheTitleCard :title="title" />
		<BaseIndicator isOnLanding hidden text="Scroll to start" />
	</header>
</template>

<script setup lang="ts">
	import TheScene from './TheScene.vue'
	import TheTitleCard from './TheTitleCard.vue'
	import BaseIndicator from '../base/BaseIndicator.vue'

	interface Props {
		title: string
		scene: string
		color?: string
	}
	const props = defineProps<Props>()

	const bgGradient = `linear-gradient(to bottom, white 0%, ${props.color} 40%, ${props.color} 60%, white 100%);`
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
