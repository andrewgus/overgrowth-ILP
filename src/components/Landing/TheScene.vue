<template>
	<div aria-hidden="true" class="scene">
		<transition name="landingScene">
			<div
				v-if="isReflectionOn"
				:class="{ reflectionBg: isBgLoaded }"
				v-show="useStore(featureSettings.isReflectionOn).value"
			></div>
		</transition>
		<!-- /.reflection -->
		<transition name="landingScene">
			<div
				v-if="isPracticeOn"
				:class="{ practiceBg: isBgLoaded }"
				v-show="useStore(featureSettings.isPracticeOn).value"
			></div>
		</transition>
		<!-- /.practice -->
		<transition name="landingScene">
			<div
				v-if="isChoiceOn"
				:class="{ choiceBg: isBgLoaded }"
				v-show="useStore(featureSettings.isChoiceOn).value"
			></div>
		</transition>
		<!-- /.choice -->
	</div>
	<!-- /.scene -->
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import { featureSettings } from '../../store/index.js'
	import { ref, watchEffect, withDefaults } from 'vue'

	interface Props {
		scene: string
		isReflectionOn?: boolean
		isPracticeOn?: boolean
		isChoiceOn?: boolean
	}
	const props = withDefaults(defineProps<Props>(), {
		isReflectionOn: false,
		isPracticeOn: false,
		isChoiceOn: false,
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

<style scoped>
	.scene {
		aspect-ratio: 21/9;
		background-image: v-bind('sceneDecor.backdrop');
		justify-self: center;
		align-self: center;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
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
	}

	.scene,
	.scene > * {
		grid-area: 1/1/-1/-1;
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		width: 100%;
	}

	.reflectionBg {
		background-image: v-bind('sceneDecor.reflection');
	}
	.practiceBg {
		background-image: v-bind('sceneDecor.practice');
	}
	.choiceBg {
		background-image: v-bind('sceneDecor.choice');
	}

	/* media queries */
	@media only screen and (max-width: 950px) {
		.scene {
			background-image: v-bind('sceneDecor.backdropSmall');
			grid-area: card-start/landing-top/card-indicator/landing-bottom;
			aspect-ratio: 4/5;
			max-height: 60vh;
			align-self: end;
		}
		.reflectionBg {
			background-image: v-bind('sceneDecor.reflectionSmall');
		}
		.practiceBg {
			background-image: v-bind('sceneDecor.practiceSmall');
		}
		.choiceBg {
			background-image: v-bind('sceneDecor.choiceSmall');
		}
	}

	/* transition styles */
	.landingScene-enter-from,
	.landingScene-leave-to {
		opacity: 0;
	}
	.landingScene-enter-active,
	.landingScene-leave-active {
		transition: opacity 0.3s ease-in-out;
	}
	.landingScene-enter-to,
	.landingScene-leave-from {
		opacity: 1;
	}
</style>
