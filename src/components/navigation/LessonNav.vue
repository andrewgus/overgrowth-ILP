<template>
	<transition name="lessonNav">
		<nav v-show="isOnContent" id="lessonNav">
			<div>
				<p>
					Currently on:
					{{ queryCurrSectionTitle }}
				</p>
				<!-- BUG: The @click on the next Prev buttons not functional. Need to figure out how to go about that. -->
				<div class="nextPrev">
					<BaseButton
						v-show="!isBookendSection().isFirst"
						link
						:href="`#${prevSection}`"
						@click="setCurrSection(`section${querycurrSectionIdNum}`)"
						class="btn_prev"
						title="Go to previous section"
						text="&#9650;"
					/>
					<BaseButton
						v-show="!isBookendSection().isLast"
						link
						:href="`#${nextSection}`"
						ref="prev"
						@click="setCurrSection(`section${querycurrSectionIdNum}`)"
						class="btn_next"
						title="Go to next section"
						text="&#9660;"
					/>
				</div>
				<Menu v-slot="{ open }">
					<MenuButton>{{
						!open ? `Take me to&hellip;` : 'Close menu'
					}}</MenuButton>
					<MenuItems as="ol">
						<MenuItem as="li" v-for="navItem in navItems" :key="navItem!.id">
							<a
								:href="`#${navItem!.id}`"
								@click="setCurrSection(navItem!.id)"
								>{{ navItem!.title }}</a
							>
						</MenuItem>
					</MenuItems>
				</Menu>
			</div>
		</nav>
	</transition>
</template>

<script setup lang="ts">
	/* TODO:

	— Refactor all this, iterating through the existing allSections nanostore map rather than the sectionTitle and sectionId atoms.

	— Next & Previous links should set the currSectionTitle & ID, just as clicking a TOC link does.

	— TOC links does not need to denote "You are here" because it is already displayed in the nav via "Currently On." Current location link should be disabled, maybe? TOC links should denote if they are locked (and therefore also disabled).

	— Next link should not be shown if the succeeding sections are locked, so without the locked class, perhaps?

	*/

	import { useStore } from '@nanostores/vue'
	import { contentQuery } from '../../store/index.js'
	import { ref, computed, onMounted, watchEffect } from 'vue'
	import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
	import BaseButton from '../base/BaseButton.vue'

	const queryOnContent = useStore(contentQuery.isOnContent)
	const queryAllSections = useStore(contentQuery.allSections)
	const querycurrSectionIdNum = useStore(contentQuery.currSectionIdNum)
	const queryCurrSectionTitle = useStore(contentQuery.currSectionTitle)

	const isOnContent = ref<boolean>()
	const nextSection = ref<string>()
	const prevSection = ref<string>()

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
		display: block;
		background-color: hsla(0, 0%, 100%, 0.95);
		padding: var(--s-5) 0;
		width: 100%;
		position: sticky;
		top: 0;
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
		border-radius: 30px 0 0 30px;
		overflow: hidden;
		border: 1px solid var(--darkGray);
	}

	.nextPrev > * + * {
		margin-left: var(--s-10);
	}
	.nextPrev > * {
		overflow: hidden;
		border-radius: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 30px;
		border: none;
	}

	div > button {
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
	div > ol {
		grid-area: 2/1/3/3;
		justify-self: center;
	}
	div > ol > li + li {
		margin-top: var(--s-3);
	}
	/* transition */
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
</style>
