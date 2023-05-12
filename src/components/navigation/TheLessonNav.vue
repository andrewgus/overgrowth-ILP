<template>
	<transition name="opacity">
		<nav
			v-if="areSectionsAvailable"
			id="lessonNav"
			:class="[$style.lessonNav, { [$style.isInvisible]: !$isOnContent }]"
		>
			<div :class="$style.navInfo">
				<p v-show="$isOnContent">{{ $currSection.title }}</p>
				<TheNextPrevSectionButtons />
				<TheNavToc />
			</div>
		</nav>
	</transition>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import { isOnContentAtom, currSectionMap } from '../../store/lessonStore'
	import useAreSectionsAvailable from '../../composables/useAreSectionsAvailable'
	import TheNavToc from './TheNavTOC.vue'
	import TheNextPrevSectionButtons from './TheNextPrevSectionButtons.vue'

	const $isOnContent = useStore(isOnContentAtom)
	const $currSection = useStore(currSectionMap)
	const { areSectionsAvailable } = useAreSectionsAvailable()
</script>

<style module lang="scss">
	@use '../../styles/mixins/transitions.scss';
	.lessonNav {
		display: block;
		background-color: hsla(0, 0%, 100%, 0.98);
		z-index: 1;
		width: 100%;
		position: sticky;
		top: 0;
		border-bottom: 1px dotted var(--lightGray);
		@include transitions.short();

		&.isInvisible {
			opacity: 0;
			transform: translateY(-10vh);
			height: 1px;
		}
		&.isInvisible:focus-within {
			opacity: 1;
			transform: translateY(0vh);
			height: auto;
		}

		> .navInfo {
			max-width: 72ch;
			width: 100%;
			margin: 0 auto;
			display: grid;
			align-items: center;
			grid-template-columns: 3fr 1fr;
			padding: var(--s-5);

			> p {
				max-width: 40ch;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
</style>
<style scoped lang="scss">
	@use '../../styles/mixins/transitions.scss';
	@include transitions.vueOpacity();
</style>
