<template>
	<header :class="$style.landing">
		<TheScene v-if="areSectionsAvailable" :scene="scene" />
		<TheTitleCard v-if="areSectionsAvailable" :title="title" />
		<BaseIndicator
			v-if="areSectionsAvailable"
			isOnLanding
			hidden
			text="Scroll to start"
			:goTo="`#${$firstSection.id}`"
		/>
	</header>
</template>

<script setup lang="ts">
	import { onMounted, ref, Ref } from 'vue'
	import { useStore } from '@nanostores/vue'
	import {
		allSectionsMap,
		firstSectionComputed,
	} from '../../store/lessonStore.js'
	import TheScene from './TheScene.vue'
	import TheTitleCard from './TheTitleCard.vue'
	import BaseIndicator from '../base/BaseIndicator.vue'

	interface Props {
		title: string
		scene: string
		color?: string
	}
	const props = defineProps<Props>()

	const $allSections = useStore(allSectionsMap)

	let areSectionsAvailable = ref<boolean>(false)
	let $firstSection: Readonly<Ref>

	onMounted(() => {
		$firstSection = useStore(firstSectionComputed)
		areSectionsAvailable.value = Object.keys($allSections.value).length > 0
	})

	const bgGradient = `linear-gradient(to bottom, white 0%, ${props.color} 40%, ${props.color} 60%, white 100%);`
</script>

<style module>
	.landing {
		background-image: v-bind(bgGradient);
		min-height: 99vh;
		width: 100vw;
		display: grid;
		grid-template-columns: [landing-top] 1fr [landing-bottom];
		grid-template-rows: [card-start] 4fr [card-indicator] 20vh [indicator-end];
	}
</style>
