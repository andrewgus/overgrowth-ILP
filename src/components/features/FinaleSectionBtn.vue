<template>
	<BaseButton
		text="Save as PDF"
		:class="$style.featureCompleteBtn"
		@btnClick="useSaveAsPDF($currSection)"
	/>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import { currSectionMap } from '../../store/lessonStore'
	import BaseButton from '../base/BaseButton.vue'
	import useSaveAsPDF from '../../composables/useSaveAsPDF'

	const $currSection = useStore(currSectionMap)
</script>

<style module lang="scss">
	.featureCompleteBtn {
		display: block;
		margin: var(--s0) auto 0;
	}
</style>
