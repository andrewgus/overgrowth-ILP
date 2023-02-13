<template>
	<nav
		:class="[
			$style.lessonNav,
			{ [$style.isInvisible]: !useStore(isOnContent).value },
		]"
		id="lessonNav"
	>
		<SkipToContent v-if="!useStore(isOnContent).value" />
		<div :class="$style.navInfo">
			<p v-show="useStore(isOnContent).value">
				Currently on:
				{{ useStore(currSectionTitle).value }}
			</p>
			<TheNextPrevSectionButtons />
			<TheNavToc />
		</div>
	</nav>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import { NavigationStore } from '../../store'
	import TheNavToc from './TheNavTOC.vue'
	import TheNextPrevSectionButtons from './TheNextPrevSectionButtons.vue'
	import SkipToContent from './SkipToContent.vue'

	const isOnContent = NavigationStore.isOnContent
	const currSectionTitle = NavigationStore.currSectionTitle
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
