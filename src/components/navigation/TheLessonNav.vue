<template>
	<transition name="lessonNav">
		<nav :class="{ isInvisible: !isOnContent }" id="lessonNav">
			<div>
				<p>
					Currently on:
					{{ queryCurrSectionTitle }}
				</p>
				<TheNextPrevSectionButtons
					:prevSection="prevSection!"
					:nextSection="nextSection!"
				/>
				<TheNavToc :currSectionId="querycurrSectionIdNum" />
			</div>
		</nav>
	</transition>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import { contentQuery } from '../../store/index.js'
	import { ref, watchEffect } from 'vue'
	import { useIsBookendSection } from '../../scripts/NavigationHandler'
	import TheNavToc from './TheNavTOC.vue'
	import TheNextPrevSectionButtons from './TheNextPrevSectionButtons.vue'

	const queryOnContent = useStore(contentQuery.isOnContent)
	const queryCurrSectionTitle = useStore(contentQuery.currSectionTitle)
	const querycurrSectionIdNum = useStore(contentQuery.currSectionIdNum)

	const isOnContent = ref<boolean>()
	const prevSection = ref<string>()
	const nextSection = ref<string>()

	const setPrevSection = () => {
		prevSection.value = !useIsBookendSection().isFirst
			? `section${querycurrSectionIdNum.value - 1}`
			: ''
	}

	const setNextSection = () => {
		nextSection.value = !useIsBookendSection().isLast
			? `section${querycurrSectionIdNum.value + 1}`
			: ''
	}

	watchEffect(() => {
		isOnContent.value = queryOnContent.value

		setPrevSection()
		setNextSection()
	})
</script>

<style scoped>
	nav {
		transition: 0.3s all ease-in-out;
		display: block;
		background-color: hsla(0, 0%, 100%, 0.95);
		padding: var(--s-5) 0;
		width: 100%;
		position: sticky;
		top: 0;
	}
	nav.isInvisible {
		visibility: hidden;
		opacity: 0;
	}
	nav > div {
		max-width: 72ch;
		margin: 0 auto;
		display: grid;
		align-items: center;
		grid-template-columns: 2.5fr 1fr;
		padding: 0 var(--s-5);
	}
	div > p {
		font-size: var(--s-1);
		max-width: 40ch;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	div > .nextPrev {
		grid-area: 1/2/2/3;
		justify-self: end;
		display: flex;
		height: 48px;
		overflow: hidden;
		border: 1px solid var(--darkGray);
		border-radius: 30px 0 0 30px;
	}
	.nextPrev > * {
		overflow: hidden;
		border-radius: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: var(--s3);
		border: none;
	}
	.nextPrev > *:visited {
		color: var(--black);
	}
	.btn_prev {
		border-radius: 20px 0 0 20px;
	}

	#menuBtn {
		grid-area: 1/3/2/4;
		justify-self: end;
		padding: var(--s-5);
		font-size: var(--s-1);
		display: inline-block;
		border-radius: 0px 30px 30px 0px;
		height: 48px;
		margin-left: var(--s-3);
	}
	#navItemsList {
		grid-area: 2/1/3/3;
		justify-self: center;
		list-style: none;
		padding: 0;
		max-width: 55ch;
		width: 100%;
	}

	#navItemsList > li + li {
		margin-top: var(--s-1);
	}
	/* lessonNav transition */
	.lessonNav-enter-from,
	.lessonNav-leave-to {
		opacity: 0;
	}
	.lessonNav-enter-active,
	.lessonNav-leave-active {
		transition: opacity 0.3s ease-in-out;
	}
	.lessonNav-enter-to,
	.lessonNav-leave-from {
		opacity: 1;
	}
	/* navTOC transition */
	.navTOC-enter-from,
	.navTOC-leave-to {
		transform: translateY(calc(-1 * var(--s0)));
		opacity: 0;
	}
	.navTOC-enter-active,
	.navTOC-leave-active {
		transition: all 0.5s ease-in-out;
	}
	.navTOC-enter-to,
	.navTOC-leave-from {
		transform: translateY(0);
		opacity: 1;
	}
</style>
