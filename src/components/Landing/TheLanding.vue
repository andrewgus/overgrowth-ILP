<template>
	<header :class="$style.landing">
		<TheScene v-if="areSectionsAvailable" :scene="scene" />
		<TheTitleCard v-if="areSectionsAvailable" :title="title" />
		<BaseIndicator
			v-if="areSectionsAvailable"
			:class="$style.onLandingIndicator"
			hidden
			text="Scroll to start"
			:goTo="`#${Object.keys($allNavSections).at(0)}`"
		/>
	</header>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import { filteredNavSectionsComputed } from '../../store/lessonStore'
	import useAreSectionsAvailable from '../../composables/useAreSectionsAvailable'
	import TheScene from './TheScene.vue'
	import TheTitleCard from './TheTitleCard.vue'
	import BaseIndicator from '../base/BaseIndicator.vue'

	interface Props {
		title: string
		scene: string
		color?: string
	}
	const props = defineProps<Props>()

	const $allNavSections = useStore(filteredNavSectionsComputed)
	const areSectionsAvailable = useAreSectionsAvailable()

	const bgGradient = `linear-gradient(to bottom, white 0%, ${props.color} 40%, ${props.color} 60%, white 100%);`
</script>

<style module lang="scss">
	.landing {
		background-image: v-bind(bgGradient);
		min-height: 99vh;
		width: 100vw;
		display: grid;
		grid-template-columns: [landing-top] 1fr [landing-bottom];
		grid-template-rows: [card-start] 4fr [card-indicator] 20vh [indicator-end];
	}
	.onLandingIndicator {
		grid-area: card-indicator/landing-top/indicator-end/landing-bottom;

		p {
			background-color: hsla(0deg, 0%, 98%, 0.5);
			filter: drop-shadow(0 0 var(--s1) var(--white));
			border-radius: var(--s10);
		}
	}
</style>
