<template>
	<nav v-if="areSectionsAvailable" id="lessonNav" :class="[$style.lessonNav, { [$style.isInvisible]: !$isOnContent }]">
		<div :class="$style.navInfo">
			<p v-show="$isOnContent">
				<span :class="$style.currentSection">Currently on:</span>
				{{ $currSection.title }}
			</p>
			<TheNextPrevSectionButtonsVue />
			<TheNavTocVue />
		</div>
	</nav>
</template>

<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { isOnContentAtom, currSectionMap } from '../../store/lessonStore'
import useAreSectionsAvailable from '../../composables/useAreSectionsAvailable'
import TheNavTocVue from './TheNavTOCVue.vue'
import TheNextPrevSectionButtonsVue from './TheNextPrevSectionButtonsVue.vue'

const $isOnContent = useStore(isOnContentAtom)
const $currSection = useStore(currSectionMap)
const { areSectionsAvailable } = useAreSectionsAvailable()
</script>

<style module lang="scss">
@use '../../styles/mixins/transitions.scss';
@use '../../styles/mixins/a11y.scss';

.lessonNav {
	display: block;
	z-index: 999;
	background-color: var(--offWhite);
	width: 100%;
	position: sticky;
	top: 0;
	border-bottom: 1px dotted var(--lightGray);
	@include transitions.short();

	&.isInvisible {
		opacity: 0;
		transform: translateY(-15vh);

		@supports (height: 1svh) {
			transform: translateY(-15svh);
		}

		height: 1px;
	}

	&.isInvisible:focus-within {
		opacity: 1;
		transform: translateY(0vh);

		@supports (height: 1svh) {
			transform: translateY(0svh);
		}

		height: auto;
	}

	>.navInfo {
		max-width: 72ch;
		width: 100%;
		margin: 0 auto;
		display: grid;
		align-items: center;
		grid-template-columns: 3fr 1fr;
		padding: var(--s-5);

		>p {
			max-width: 40ch;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
}

@media only screen and (max-width: 450px) {
	.currentSection {
		@include a11y.visuallyHidden();
	}
}
</style>
<style scoped lang="scss">
@use '../../styles/mixins/transitions.scss';
@include transitions.vueOpacity();
</style>
