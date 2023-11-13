<template>
	<TransitionGroup aria-hidden="true" :class="$style.scene" tag="div" name="opacity">
		<div key="reflection" v-show="$activities.reflection !== false" :class="$style.reflectionBg"></div>
		<div key="practice" v-show="$activities.practice !== false" :class="$style.practiceBg">
		</div>
	</TransitionGroup>
</template>

<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { activitiesMap } from '../../store/lessonStore'

type Props = { scene: string }
const props = defineProps<Props>()

const imgURL = (type?: string) => `url('https://fscjcel.blob.core.windows.net/platform-scenes/${props.scene}${type ? `-${type}` : ''}.svg')`

const sceneDecor = {
	backdrop: imgURL(),
	reflection: imgURL('reflection'),
	practice: imgURL('practice'),
}

const $activities = useStore(activitiesMap)
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
			black 33%,
			black 67%,
			transparent 100%);
	mask-image: linear-gradient(transparent 0%,
			black 33%,
			black 67%,
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
