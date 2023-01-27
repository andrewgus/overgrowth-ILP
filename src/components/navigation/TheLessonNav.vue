<template>
	<transition name="lessonNav">
		<nav
			:class="[$style.lessonNav, { [$style.isInvisible]: !isOnContent }]"
			id="lessonNav"
		>
			<SkipToContent v-if="!isOnContent" />
			<div :class="$style.navInfo">
				<p v-show="!!queryCurrSectionTitle">
					Currently on:
					{{ queryCurrSectionTitle }}
				</p>
				<TheNextPrevSectionButtons
					:currSectionId="querycurrSectionIdNum"
					:prevSection="prevSection!"
					:nextSection="nextSection!"
				/>
				<TheNavToc :currSectionId="querycurrSectionIdNum" />
			</div>
		</nav>
	</transition>
</template>

<script setup lang="ts">
	import { ref, watchEffect } from 'vue'
	import { useStore } from '@nanostores/vue'
	import { contentQuery } from '../../store/index.js'
	import TheNavToc from './TheNavTOC.vue'
	import TheNextPrevSectionButtons from './TheNextPrevSectionButtons.vue'
	import SkipToContent from './SkipToContent.vue'
	import { useIsBookendSection } from '../../composables/UseNavigation'

	const queryOnContent = useStore(contentQuery.isOnContent)
	const queryCurrSectionTitle = useStore(contentQuery.currSectionTitle)
	const querycurrSectionIdNum = useStore(contentQuery.currSectionIdNum)

	const isOnContent = ref<boolean>(true)
	const prevSection = ref<string>('#')
	const nextSection = ref<string>('#')

	const setPrevSection = () => {
		prevSection.value = !useIsBookendSection.value.isFirst
			? `section${querycurrSectionIdNum.value - 1}`
			: ''
	}

	const setNextSection = () => {
		nextSection.value = !useIsBookendSection.value.isLast
			? `section${querycurrSectionIdNum.value + 1}`
			: ''
	}

	watchEffect(() => {
		isOnContent.value = queryOnContent.value

		setPrevSection()
		setNextSection()
	})
</script>

<style module lang="scss">
	.lessonNav {
		-webkit-transition: 0.3s all ease-in-out;
		transition: 0.3s all ease-in-out;
		display: block;
		background-color: hsla(0, 0%, 100%, 0.95);
		padding: var(--s-5) 0;
		width: 100%;
		position: sticky;
		top: 0;

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
<style scoped>
	/* lessonNav transition */
	.lessonNav-enter-from,
	.lessonNav-leave-to {
		opacity: 0;
	}
	.lessonNav-enter-active,
	.lessonNav-leave-active {
		-webkit-transition: opacity 0.3s ease-in-out;
		transition: opacity 0.3s ease-in-out;
	}
	.lessonNav-enter-to,
	.lessonNav-leave-from {
		opacity: 1;
	}
</style>
