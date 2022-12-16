<template>
	<div class="background">
		<TheScene />
		<TitleCard :title="title" />
	</div>
</template>

<script setup lang="ts">
	import TheScene from '../components/Landing/TheScene.vue'
	import TitleCard from '../components/Landing/TitleCard.vue'

	defineProps({
		title: {
			type: String,
			required: true,
		},
	})
</script>

<style scoped>
	.background {
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 1) 0%,
			rgba(222, 242, 238, 1) 12%,
			rgba(171, 222, 213, 1) 25%,
			rgba(120, 201, 187, 1) 33%,
			rgba(88, 184, 151, 1) 77%,
			rgba(175, 221, 205, 1) 88%,
			rgba(255, 255, 255, 1) 100%
		);
		height: 100vh;
		width: 100vw;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
	}
</style>
