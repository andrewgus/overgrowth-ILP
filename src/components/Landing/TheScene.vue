<template>
	<div aria-hidden="true" class="imgs">
		<div
			v-if="useStore(featureSettings.isReflectionOn).value"
			class="reflection"
		></div>
		<!-- /.reflection -->
		<div
			v-if="useStore(featureSettings.isPracticeOn).value"
			class="practice"
		></div>
		<!-- /.practice -->
		<div v-if="useStore(featureSettings.isChoiceOn).value" class="choice"></div>
		<!-- /.choice -->
	</div>
	<!-- /.imgs -->
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import featureSettings from '../../store/index.js'
</script>

<style scoped>
	.imgs {
		grid-area: 1/1/-1/-1;
		justify-self: center;
		align-self: center;
		background-image: url('/img/landing/setting.svg');
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		aspect-ratio: 21/9;
	}
	.imgs,
	.imgs > * {
		grid-area: 1/1/-1/-1;
		background-size: cover;
		background-repeat: no-repeat;
		width: 100%;
	}

	.imgs > .reflection {
		background-image: url('/img/landing/setting-reflection.svg');
	}
	.imgs > .practice {
		background-image: url('/img/landing/setting-practice.svg');
	}
	.imgs > .choice {
		background-image: url('/img/landing/setting-choice.svg');
	}
</style>
