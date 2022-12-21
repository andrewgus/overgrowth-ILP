<template>
	<div class="titleCard">
		<h1>{{ title }}</h1>
		<p>Included in this lesson are&hellip;</p>
		<ul class="options">
			<ToggleFeature
				@click="featureSettings.reflectionToggle"
				:setting="useStore(featureSettings.isReflectionOn).value"
				type="Reflection"
			/>
			<div
				role="separator"
				aria-hidden="true"
				aria-orientation="vertical"
			></div>
			<ToggleFeature
				@click="featureSettings.practiceToggle"
				:setting="useStore(featureSettings.isPracticeOn).value"
				type="Practice"
			/>
			<div
				role="separator"
				aria-hidden="true"
				aria-orientation="vertical"
			></div>
			<ToggleFeature
				@click="featureSettings.choiceToggle"
				:setting="useStore(featureSettings.isChoiceOn).value"
				type="Choice"
			/>
		</ul>
		<!-- /.options -->
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
	.titleCard {
		grid-area: 1/1/-1/-1;
		justify-self: center;
		align-self: start;
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-between;
		align-items: center;
		border-radius: 30px;
		background-color: hsla(0deg, 0%, 98%, 0.5);
		filter: drop-shadow(0 0 var(--s1) var(--white));
		padding: var(--s0);
		margin-top: var(--s2);
	}
	.titleCard h1 {
		margin: 0;
		text-align: center;
	}
	.titleCard p {
		margin-bottom: var(--s-3);
	}
	.options {
		padding-left: 0;
		margin: 0;
		display: flex;
		justify-content: center;
		flex-flow: row nowrap;
		gap: var(--s-5);
	}
	.options > div[role='separator'] {
		flex-grow: 0;
		border: 1.25px solid var(--lightGray);

		border-radius: var(--s5);
	}
</style>
