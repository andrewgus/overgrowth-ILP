<template>
	<div class="flex">
		<h1>{{ title }}</h1>
		<div class="toggleGroup">
			<ToggleFeature
				@click="featureSettings.reflectionToggle"
				:setting="useStore(featureSettings.isReflectionOn).value"
				name="Reflection"
			/>
			<ToggleFeature
				@click="featureSettings.practiceToggle"
				:setting="useStore(featureSettings.isPracticeOn).value"
				name="Practice"
			/>
			<ToggleFeature
				@click="featureSettings.choiceToggle"
				:setting="useStore(featureSettings.isChoiceOn).value"
				name="Choice"
			/>
		</div>
		<!-- /.toggleGroup -->
		<p>
			{{
				useStore(featureSettings.isReflectionOn).value
					? 'Reflection On'
					: ' Reflection Off'
			}}
		</p>
		<p>
			{{
				useStore(featureSettings.isPracticeOn).value
					? 'Practice On'
					: ' Practice Off'
			}}
		</p>
		<p>
			{{
				useStore(featureSettings.isChoiceOn).value ? 'Choice On' : ' Choice Off'
			}}
		</p>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue'

	import { useStore } from '@nanostores/vue'
	import featureSettings from '../store/index.js'

	import ToggleFeature from '../components/Landing/ToggleSwitch.vue'

	defineProps({
		title: {
			type: String,
			required: true,
		},
	})

	const setSetting = () => []
</script>

<style scoped>
	.flex {
		display: flex;
		flex-flow: column nowrap;
	}
	h1 {
		text-align: center;
	}
	.toggleGroup {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-1);
	}
	.toggleGroup > * {
		flex-grow: 1;
		flex-basis: calc((60ch - 100%) * 999);
	}
</style>
