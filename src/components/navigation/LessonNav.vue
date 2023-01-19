<template>
	<transition name="lessonNav">
		<nav :class="{ isInvisible: !isOnContent }" id="lessonNav">
			<div>
				<p>
					Currently on:
					{{ queryCurrSectionTitle }}
				</p>
				<div class="nextPrev">
					<BaseButton
						:isDisabled="isBookendSection().isFirst"
						link
						:href="`#${prevSection}`"
						@click="setCurrSection(`section${querycurrSectionIdNum}`)"
						class="btn_prev"
						title="Go to previous section"
						aria-label="Go to previous section"
						text="&#9650;"
					/>
					<BaseButton
						:isDisabled="isBookendSection().isLast"
						link
						:href="`#${nextSection}`"
						ref="prev"
						@click="setCurrSection(`section${querycurrSectionIdNum}`)"
						class="btn_next"
						title="Go to next section"
						aria-label="Go to next section"
						text="&#9660;"
					/>
				</div>

				<button
					id="menuBtn"
					aria-haspopup="menu"
					:aria-expanded="isMenuOpen"
					aria-controls="navItemsList"
					@click="openMenu"
				>
					{{ !isMenuOpen ? 'Go to&hellip;' : 'Close' }}
				</button>
				<transition appear name="navTOC">
					<ol
						v-show="isMenuOpen"
						aria-label="table of contents links"
						id="navItemsList"
					>
						<li v-for="navItem in navItems" :key="navItem!.id">
							<a :href="`#${navItem!.id}`" @click="navToSection(navItem!.id)">{{
								navItem!.title
							}}</a>
						</li>
					</ol>
				</transition>
			</div>
		</nav>
	</transition>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import { contentQuery } from '../../store/index.js'
	import { ref, computed, onMounted, watchEffect } from 'vue'
	import BaseButton from '../base/BaseButton.vue'

	const isMenuOpen = ref(false)

	const openMenu = () => (isMenuOpen.value = !isMenuOpen.value)

	const navToSection = (section: string) => {
		setCurrSection(section)
		isMenuOpen.value = !isMenuOpen.value
	}

	const queryOnContent = useStore(contentQuery.isOnContent)
	const queryAllSections = useStore(contentQuery.allSections)
	const querycurrSectionIdNum = useStore(contentQuery.currSectionIdNum)
	const queryCurrSectionTitle = useStore(contentQuery.currSectionTitle)

	const navItems = computed(() => {
		let titles: string[] = []
		let sectionIds: string[] = []

		queryAllSections.value.forEach((s: HTMLElement) => {
			titles.push(s.querySelector('h2')!.textContent!)
			sectionIds.push(s.id)
		})

		const allSectionsObj: {
			[key: string]: {
				id: string
				title: string
			}
		} = {}

		for (const [i, sectionId] of sectionIds.entries()) {
			allSectionsObj[sectionId] = {
				id: sectionId,
				title: titles[i],
			}
		}
		console.log(Object.keys(allSectionsObj).length)
		return allSectionsObj
	})

	const setCurrSection = (sectionId: string) => {
		contentQuery.setCurrSection(sectionId)
	}

	const isBookendSection = () => {
		const currSectionIdNum = `section${querycurrSectionIdNum.value}`
		const bookendSectionId = {
			first: Object.keys(navItems.value).at(0),
			last: Object.keys(navItems.value).at(-1),
		}

		const isFirst = currSectionIdNum === bookendSectionId.first
		const isLast = currSectionIdNum === bookendSectionId.last

		return { isFirst, isLast }
	}

	const isOnContent = ref<boolean>()
	const nextSection = ref<string>()
	const prevSection = ref<string>()

	const setPrevSection = () => {
		prevSection.value = !isBookendSection().isFirst
			? `section${querycurrSectionIdNum.value - 1}`
			: ''
	}

	const setNextSection = () => {
		nextSection.value = !isBookendSection().isLast
			? `section${querycurrSectionIdNum.value + 1}`
			: ''
	}

	onMounted(() => {
		isOnContent.value = queryOnContent.value

		watchEffect(() => {
			isOnContent.value = queryOnContent.value

			setPrevSection()
			setNextSection()
		})
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
	.btn_prev {
		border-radius: 30px 0 0 30px;
	}

	#menuBtn {
		cursor: pointer;
		grid-area: 1/3/2/4;
		justify-self: end;
		box-shadow: none;
		border: 1px solid var(--darkGray);
		padding: var(--s-5);
		font-size: var(--s-1);
		background-color: var(--lightBlue);
		display: inline-block;
		border-radius: 0px 30px 30px 0px;
		height: 48px;
		margin-left: var(--s-3);
	}
	#navItemsList {
		grid-area: 2/1/3/3;
		justify-self: center;
	}
	#navItemsList > li + li {
		margin-top: var(--s-3);
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
