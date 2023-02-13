<template>
	<section
		v-show="useStore(FeatureSettingsStore.features).value.practice"
		class="feature"
		:class="$style.practiceFeature"
	>
		<h2>{{ title }}</h2>
	</section>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import { NavigationStore, FeatureSettingsStore } from '../store'
	import { onBeforeMount, computed, ComputedRef } from 'vue'

	const props = defineProps({
		title: {
			type: String,
			required: true,
		},
	})

	FeatureSettingsStore.useDoesFeatureExist('practice')
</script>

<style module lang="scss">
	.practiceFeature {
		color: var(--black);
	}
</style>
