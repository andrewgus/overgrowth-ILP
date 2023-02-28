<template>
	<nav
		v-if="areSectionsAvailable"
		id="lessonNav"
		:class="[$style.lessonNav, { [$style.isInvisible]: !$isOnContent }]"
	>
		<SkipToContent v-if="!$isOnContent && areSectionsAvailable" />
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
	import { ref, onMounted } from 'vue'
	import { useStore } from '@nanostores/vue'
	import {
		isOnContentAtom,
		allSectionsMap,
		currSectionMap,
		filteredNavSectionsComputed,
	} from '../../store/lessonStore'
	import TheNavToc from './TheNavTOC.vue'
	import TheNextPrevSectionButtons from './TheNextPrevSectionButtons.vue'
	import SkipToContent from './SkipToContent.vue'

	const $isOnContent = useStore(isOnContentAtom)
	const $allSections = useStore(allSectionsMap)
	const $currSection = useStore(currSectionMap)

	let areSectionsAvailable = ref<boolean>(false)
	onMounted(() => {
		areSectionsAvailable.value = Object.keys($allSections.value).length > 0
	})
</script>

<style module lang="scss">
	.lessonNav {
		-webkit-transition: var(--timeShort) all ease-in-out;
		transition: var(--timeShort) all ease-in-out;
		display: block;
		background-color: hsla(0, 0%, 100%, 0.95);
		padding: var(--s-5) 0 0;
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
			padding: 0 var(--s-5);

			> p {
				font-size: var(--s-1);
				max-width: 40ch;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
</style>
