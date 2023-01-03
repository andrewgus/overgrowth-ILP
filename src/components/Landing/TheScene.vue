<template>
	<div aria-hidden="true" class="scene" :style="scene">
		<transition name="landingScene">
			<div
				v-show="useStore(featureSettings.isReflectionOn).value"
				:style="isBgLoaded ? reflection : ''"
			></div>
		</transition>
		<!-- /.reflection -->
		<transition name="landingScene">
			<div
				v-show="useStore(featureSettings.isPracticeOn).value"
				:style="isBgLoaded ? practice : ''"
			></div>
		</transition>
		<!--isC/.practice -->
		<transition name="landingScene">
			<div
				v-show="useStore(featureSettings.isChoiceOn).value"
				:style="isBgLoaded ? choice : ''"
			></div>
		</transition>
		<!-- /.choice -->
	</div>
	<!-- /.scene -->
</template>

<script setup lang="ts">
	import { ref, computed, watchEffect } from 'vue'

	import { useStore } from '@nanostores/vue'
	import featureSettings from '../../store/index.js'

	const props = defineProps({
		scene: {
			type: String,
			required: true,
		},
		isReflection: {
			type: Boolean,
			required: false,
			default: true,
		},
		isPractice: {
			type: Boolean,
			required: false,
			default: true,
		},
		isChoice: {
			type: Boolean,
			required: false,
			default: true,
		},
	})

	const isBgLoaded = ref(false)

	watchEffect(() => {
		const img = new Image()
		img.src = `https://fscjcel.blob.core.windows.net/platform-scenes/${props.scene}.svg`
		img.onload = () => (isBgLoaded.value = true)
	})

	const scene = computed(() => {
		return `background-image: url('https://fscjcel.blob.core.windows.net/platform-scenes/${props.scene}.svg');`
	})

	const reflection = computed(() => {
		return `background-image: url('https://fscjcel.blob.core.windows.net/platform-scenes/${props.scene}-reflection.svg');`
	})
	const practice = computed(() => {
		return `background-image: url('https://fscjcel.blob.core.windows.net/platform-scenes/${props.scene}-practice.svg');`
	})
	const choice = computed(() => {
		return `background-image: url('https://fscjcel.blob.core.windows.net/platform-scenes/${props.scene}-choice.svg');`
	})
</script>

<style scoped>
	.scene {
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
