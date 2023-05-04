<template>
	<nav
		v-if="areSectionsAvailable"
		id="lessonNav"
		:class="[$style.lessonNav, { [$style.isInvisible]: !$isOnContent }]"
	>
		<div :class="$style.navInfo">
			<p v-if="!!$currSection" v-show="$isOnContent">
				Currently on:
				{{ $currSection.title }}
			</p>
			<TheNextPrevSectionButtons />
			<TheNavToc />
		</div>
	</nav>
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
	.lessonNav {
		-webkit-transition: var(--timeShort) all ease-in-out;
		transition: var(--timeShort) all ease-in-out;
		display: block;
		background-color: hsla(0, 0%, 100%, 0.98);
		z-index: 1;
		width: 100%;
		position: sticky;
		top: 0;
		border-bottom: 1px dotted var(--lightGray);

		&.isInvisible {
			opacity: 0;
		}
		&.isInvisible:focus-within {
			opacity: 1;
		}

		> .navInfo {
			max-width: 72ch;
			margin: 0 auto;
			display: grid;
			align-items: center;
			grid-template-columns: 2.5fr 1fr;
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
