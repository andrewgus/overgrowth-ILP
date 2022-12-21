<template>
	<header :style="{ backgroundImage: `${bgGradient}` }">
		<TheScene :scene="image" />
		<TitleCard :title="title" />
		<TheIndicator />
	</header>
</template>

<script setup lang="ts">
	import { computed } from 'vue'

	import TheScene from '../components/Landing/TheScene.vue'
	import TitleCard from '../components/Landing/TitleCard.vue'
	import TheIndicator from '../components/Landing/TheIndicator.vue'

	const props = defineProps({
		title: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
			validator(value: string) {
				const exclude: string[] = ['-', ' ', '_']
				exclude.some((str) => value.includes(str)) &&
					console.error(
						'TheLanding image prop string cannot include spaces, hypens, or underscores.'
					)
				return !exclude.some((str) => value.includes(str))
			},
		},
		color: {
			type: String,
		},
	})

	const bgGradient = computed(() => {
		return `linear-gradient(180deg, white 0%, ${props.color} 50%, white 100%);`
	})
</script>

<style scoped>
	header {
		height: 95vh;
		width: 100vw;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
	}
</style>
