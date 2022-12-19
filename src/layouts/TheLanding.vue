<template>
	<div class="landing" :style="{ backgroundImage: `${bgGradient}` }">
		<TheScene />
		<TitleCard :title="title" />
		<TheIndicator />
	</div>
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
		color: {
			type: String,
		},
	})
	const bgGradient = computed(() => {
		return `linear-gradient(180deg, white 0%, ${props.color} 50%, white 100%);`
	})
</script>

<style scoped>
	.landing {
		height: 100vh;
		width: 100vw;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
	}
</style>
