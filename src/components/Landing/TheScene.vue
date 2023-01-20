<template>
	<div aria-hidden="true" class="scene">
		<transition name="landingScene">
			<div
				v-if="isReflectionOn"
				:class="{ reflectionSwitch: isBgLoaded }"
				v-show="useStore(featureSettings.isReflectionOn).value"
			></div>
		</transition>
		<!-- /.reflection -->
		<transition name="landingScene">
			<div
				v-if="isPracticeOn"
				:class="{ practiceSwitch: isBgLoaded }"
				v-show="useStore(featureSettings.isPracticeOn).value"
			></div>
		</transition>
		<!-- /.practice -->
		<transition name="landingScene">
			<div
				v-if="isChoiceOn"
				:class="{ choiceSwitch: isBgLoaded }"
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
	import { ref, computed, watchEffect, withDefaults, onMounted } from 'vue'

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

	const sceneBg = computed(() => {
		return `url('https://fscjcel.blob.core.windows.net/platform-scenes/${props.scene}.svg');`
	})

	const reflectionImg = computed(() => {
		return `url('https://fscjcel.blob.core.windows.net/platform-scenes/${props.scene}-reflection.svg');`
	})

	const practiceImg = computed(() => {
		return `url('https://fscjcel.blob.core.windows.net/platform-scenes/${props.scene}-practice.svg');`
	})

	const choiceImg = computed(() => {
		return `url('https://fscjcel.blob.core.windows.net/platform-scenes/${props.scene}-choice.svg');`
	})
</script>

<style scoped>
	.scene {
		background-image: v-bind(sceneBg);
		justify-self: center;
		align-self: center;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		aspect-ratio: 21/9;
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
	@media only screen and (max-width: 700px) and (max-height: 850px) {
		.scene {
			margin-bottom: var(--s4);
			align-self: end;
		}
	}
	.scene,
	.scene > * {
		grid-area: 1/1/-1/-1;
		background-size: cover;
		background-repeat: no-repeat;
		width: 100%;
	}
	.reflectionSwitch {
		background-image: v-bind(reflectionImg);
	}
	.choiceSwitch {
		background-image: v-bind(choiceImg);
	}
	.practiceSwitch {
		background-image: v-bind(practiceImg);
	}
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
