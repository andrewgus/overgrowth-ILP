<template>
	<TransitionGroup
		name="landingScene"
		tag="div"
		aria-hidden="true"
		:class="$style.scene"
	>
		<div
			v-if="FeatureSettingsStore.useFeatureExists('reflection')"
			key="reflection"
			v-show="useStore(FeatureSettingsStore.features).value.reflection"
			:class="{ [$style.reflectionBg]: isBgLoaded }"
		></div>
		<div
			v-if="FeatureSettingsStore.useFeatureExists('practice')"
			key="practice"
			v-show="useStore(FeatureSettingsStore.features).value.practice"
			:class="{ [$style.practiceBg]: isBgLoaded }"
		></div>
		<div
			v-if="FeatureSettingsStore.useFeatureExists('choice')"
			key="choice"
			v-show="useStore(FeatureSettingsStore.features).value.choice"
			:class="{ [$style.choiceBg]: isBgLoaded }"
		></div>
	</TransitionGroup>
</template>

<script setup lang="ts">
	import { ref, watchEffect } from 'vue'
	import { useStore } from '@nanostores/vue'
	import { FeatureSettingsStore } from '../../store'

	const props = defineProps({
		scene: {
			type: String,
			required: true,
		},
	})

	const isBgLoaded = ref(false)

	watchEffect(() => {
		const img = new Image()
		img.src = `https://fscjcel.blob.core.windows.net/platform-scenes/${props.scene}.svg`
		img.onload = () => (isBgLoaded.value = true)
	})

	const imgURL = (type?: string) => {
		return `url('https://fscjcel.blob.core.windows.net/platform-scenes/${
			props.scene
		}${type ? `-${type}` : ''}.svg')`
	}

	const sceneDecor = {
		backdrop: imgURL(),
		backdropSmall: imgURL('small'),
		reflection: imgURL('reflection'),
		reflectionSmall: imgURL('reflection-small'),
		practice: imgURL('practice'),
		practiceSmall: imgURL('practice-small'),
		choice: imgURL('choice'),
		choiceSmall: imgURL('choice-small'),
	}
</script>

<style module lang="scss">
	.scene {
		aspect-ratio: 21/9;
		background-image: v-bind('sceneDecor.backdrop');
		justify-self: center;
		align-self: center;
		display: grid;
		grid-template: 1fr / 1fr;
		-webkit-mask-image: linear-gradient(
			transparent 0%,
			black 20%,
			black 80%,
			transparent 100%
		);
		mask-image: linear-gradient(
			transparent 0%,
			black 20%,
			black 80%,
			transparent 100%
		);

		&,
		& > * {
			grid-area: 1/1/-1/-1;
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center;
			width: 100%;
		}
		> .reflectionBg {
			background-image: v-bind('sceneDecor.reflection');
		}
		> .practiceBg {
			background-image: v-bind('sceneDecor.practice');
		}
		> .choiceBg {
			background-image: v-bind('sceneDecor.choice');
		}
	}

	/* media queries */
	@media only screen and (max-width: 950px) {
		.scene {
			background-image: v-bind('sceneDecor.backdropSmall');
			grid-area: card-start/landing-top/card-indicator/landing-bottom;
			aspect-ratio: 4/5;
			max-height: 60vh;
			align-self: end;
			> .reflectionBg {
				background-image: v-bind('sceneDecor.reflectionSmall');
			}
			> .practiceBg {
				background-image: v-bind('sceneDecor.practiceSmall');
			}
			> .choiceBg {
				background-image: v-bind('sceneDecor.choiceSmall');
			}
		}
	}
</style>
<style scoped>
	/* transition styles */
	.landingScene-enter-from,
	.landingScene-leave-to {
		opacity: 0;
	}
	.landingScene-enter-active,
	.landingScene-leave-active {
		transition: var(--timeShort) opacity ease-in-out;
	}
	.landingScene-enter-to,
	.landingScene-leave-from {
		opacity: 1;
	}
</style>
