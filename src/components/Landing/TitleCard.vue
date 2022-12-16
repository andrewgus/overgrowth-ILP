<template>
	<div class="info">
		<h1>{{ title }}</h1>
		<div class="toggleGroup">
			<ToggleFeature
				@click="featureSettings.reflectionToggle"
				:setting="useStore(featureSettings.isReflectionOn).value"
				type="Reflection"
			/>
			<ToggleFeature
				@click="featureSettings.practiceToggle"
				:setting="useStore(featureSettings.isPracticeOn).value"
				type="Practice"
			/>
			<ToggleFeature
				@click="featureSettings.choiceToggle"
				:setting="useStore(featureSettings.isChoiceOn).value"
				type="Choice"
			/>
		</div>
		<!-- /.toggleGroup -->
	</div>
	<!-- /.info -->
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import featureSettings from '../../store/index.js'
	import ToggleFeature from '../base/ToggleSwitch.vue'

	defineProps({
		title: {
			type: String,
			required: true,
		},
	})
</script>

<style scoped>
	.info {
		grid-area: 1/1/-1/-1;
		justify-self: center;
		align-self: start;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
		border-radius: 30px;
		background-color: rgba(255, 255, 255, 0.5);
		filter: drop-shadow(0 0 var(--s1) white);
		padding: var(--s2);
		margin-top: var(--s3);
	}
	.info h1 {
		margin-top: 0;
		text-align: center;
	}
	.toggleGroup {
		max-width: 60ch;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: var(--s1);
	}
	.toggleGroup > * {
		flex-grow: 1;
		flex-basis: calc((30ch - 100%) * 999);
	}
</style>
