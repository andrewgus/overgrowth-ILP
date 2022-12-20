<template>
	<div aria-hidden="true" class="scene">
		<transition name="landingScene">
			<div
				v-show="useStore(featureSettings.isReflectionOn).value"
				key="1"
				class="reflection"
			></div>
		</transition>
		<!-- /.reflection -->
		<transition name="landingScene">
			<div
				v-show="useStore(featureSettings.isPracticeOn).value"
				key="2"
				class="practice"
			></div>
		</transition>
		<!-- /.practice -->
		<transition name="landingScene">
			<div
				v-show="useStore(featureSettings.isChoiceOn).value"
				key="3"
				class="choice"
			></div>
		</transition>
		<!-- /.choice -->
	</div>
	<!-- /.scene -->
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import featureSettings from '../../store/index.js'

	const props = defineProps({
		scene: {
			type: String,
			required: true,
		},
	})
	
</script>

<style scoped>
	.scene {
		justify-self: center;
		align-self: center;
		background-image: url('https://fscjcel.blob.core.windows.net/testimgs/setting.svg');
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
	@media only screen and (max-width: 30em) and (max-height: 700px) {
		.scene {
			margin-bottom: var(--s2);
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

	.reflection {
		background-image: url('https://fscjcel.blob.core.windows.net/testimgs/setting-reflection.svg');
	}
	.practice {
		background-image: url('https://fscjcel.blob.core.windows.net/testimgs/setting-practice.svg');
	}
	.choice {
		background-image: url('https://fscjcel.blob.core.windows.net/testimgs/setting-choice.svg');
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
