<template>
	<TransitionGroup v-if="areSectionsAvailable" aria-hidden="true" :class="$style.scene" tag="div" name="opacity">
		<div v-if="useActivityExists('reflection')" key="reflection" v-show="$activities.reflection"
			:class="{ [$style.reflectionBg]: isBgLoaded }"></div>
		<div v-if="useActivityExists('practice')" key="practice" v-show="$activities.practice"
			:class="{ [$style.practiceBg]: isBgLoaded }"></div>
		<div v-if="useActivityExists('choice')" key="choice" v-show="$activities.choice"
			:class="{ [$style.choiceBg]: isBgLoaded }"></div>
	</TransitionGroup>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useStore } from '@nanostores/vue'
import { activitiesMap, useActivityExists } from '../../store/lessonStore'
import useAreSectionsAvailable from '../../composables/useAreSectionsAvailable'
const { areSectionsAvailable } = useAreSectionsAvailable()

const props = defineProps({
	scene: {
		type: String,
		required: true,
	},
})

const $activities = useStore(activitiesMap)
const isBgLoaded = ref(false)

const imgURL = (type?: string) => {
	return `url('https://fscjcel.blob.core.windows.net/platform-scenes/${props.scene
		}${type ? `-${type}` : ''}.svg')`
}

const sceneDecor = {
	backdrop: imgURL(),
	reflection: imgURL('reflection'),
	practice: imgURL('practice'),
	choice: imgURL('choice'),
}
watchEffect(() => {
	const img = new Image()
	img.src = `https://fscjcel.blob.core.windows.net/platform-scenes/${props.scene}.svg`
	img.onload = () => (isBgLoaded.value = true)
})
</script>

<style module lang="scss">
.scene {
	opacity: .5;
	aspect-ratio: 21/9;
	background-image: v-bind('sceneDecor.backdrop');
	justify-self: center;
	align-self: center;
	margin-top: var(--s10);
	display: grid;
	grid-template: 1fr / 1fr;
	-webkit-mask-image: linear-gradient(transparent 0%,
			black 20%,
			black 80%,
			transparent 100%);
	mask-image: linear-gradient(transparent 0%,
			black 20%,
			black 80%,
			transparent 100%);

	&,
	&>* {
		grid-area: 1/1/-1/-1;
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		width: 100%;
	}

	>.reflectionBg {
		background-image: v-bind('sceneDecor.reflection');
	}

	>.practiceBg {
		background-image: v-bind('sceneDecor.practice');
	}

	>.choiceBg {
		background-image: v-bind('sceneDecor.choice');
	}
}

/* media queries */
@media only screen and (max-width: 950px) {
	.scene {
		aspect-ratio: 16/9;
	}
}
</style>
<style scoped lang="scss">
@use '../../styles/mixins/transitions.scss';
@include transitions.vueOpacity();
</style>
