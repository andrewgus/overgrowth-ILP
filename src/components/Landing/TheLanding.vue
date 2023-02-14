<template>
	<header :class="$style.landing">
		<TheScene v-if="isListAvailable" :scene="scene" />
		<TheTitleCard v-if="isListAvailable" :title="title" />
		<BaseIndicator isOnLanding hidden text="Scroll to start" />
	</header>
</template>

<script setup lang="ts">
	import TheScene from './TheScene.vue'
	import TheTitleCard from './TheTitleCard.vue'
	import BaseIndicator from '../base/BaseIndicator.vue'
	import { useStore } from '@nanostores/vue'
	import { NavigationStore } from '../../store'
	import { onMounted, ref } from 'vue'

	interface Props {
		title: string
		scene: string
		color?: string
	}
	const props = defineProps<Props>()

	let isListAvailable = ref<boolean>(false)
	onMounted(() => {
		isListAvailable.value =
			Object.keys(useStore(NavigationStore.allSectionsMap).value).length > 0
		console.log(isListAvailable.value)
	})

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
