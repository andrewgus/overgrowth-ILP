<!-- TODO: Optionally, the complete btn can instead be a "Save & Complete" btn, where users will not only complete and continue, but also download a PDF of that activity, so that they can provide their finished results to their professor -->

<template>
	<transition mode="out-in">
		<BaseButton
			v-if="!complete"
			text="Complete?"
			:class="$style.featureCompleteBtn"
			@btnClick="setComplete"
		></BaseButton>
		<BaseIndicator
			v-else
			text="Scoll to continue"
			:goTo="`#${nextSection}`"
		></BaseIndicator>
	</transition>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { useStore } from '@nanostores/vue'
	import {
		currSectionMap,
		useSetCurrSection,
		nextSectionComputed,
	} from '../../store/NavigationStore'
	import BaseButton from '../base/BaseButton.vue'
	import BaseIndicator from '../base/BaseIndicator.vue'

	const complete = ref<boolean>(false)
	const nextSection = useStore(nextSectionComputed)
	let completedFeature: string

	const setComplete = ({ target }: Event) => {
		const clicked = target as HTMLElement
		if (!clicked) return

		const thisSection = clicked.closest('section')
		console.log(thisSection)
		completedFeature = thisSection!.id
		useSetCurrSection(completedFeature)

		currSectionMap.setKey('isLocked', false)
		complete.value = true
	}
</script>

<style module lang="scss">
	.featureCompleteBtn {
		display: block;
		margin: var(--s0) auto 0;
	}
</style>
<style scoped>
	/* transition styles */
	.v-enter-from,
	.v-leave-to {
		opacity: 0;
	}
	.v-enter-active,
	.v-leave-active {
		transition: var(--timeShort) opacity ease-in-out;
	}
	.v-enter-to,
	.v-leave-from {
		opacity: 1;
	}
</style>
