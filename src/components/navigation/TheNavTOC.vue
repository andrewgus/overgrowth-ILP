<template>
	<BaseButton
		:class="$style.btnTOC"
		:text="!isMenuOpen ? 'Go to&hellip;' : 'Close'"
		aria-haspopup="menu"
		:aria-expanded="isMenuOpen"
		aria-controls="navItemsList"
		@click="toggleMenu"
	/>
	<transition
		:css="false"
		@before-enter="onBeforeEnter"
		@enter="onEnter"
		@before-leave="onBeforeLeave"
	>
		<div id="navItemsList" v-show="isMenuOpen" :class="$style.lessonTOC">
			<h2 class="visuallyHidden">Navigation Links</h2>
			<ol>
				<li
					v-for="navItem in $allNavSections"
					:key="navItem.id"
					:class="{ [$style.greenDot]: isLocatedHere(navItem.id) }"
				>
					<a
						:href="`#${navItem.id}`"
						@click="navToSection(navItem.id)"
						:aria-current="isLocatedHere(navItem.id) ? 'page' : false"
						>{{ navItem!.title }}</a
					>
				</li>
			</ol>
		</div>
	</transition>
</template>

<script setup lang="ts">
	import { ref, useCssModule } from 'vue'
	import { useStore } from '@nanostores/vue'
	import {
		filteredNavSectionsComputed,
		currSectionMap,
		useSetCurrSection,
	} from '../../store/lessonStore'
	import BaseButton from '../base/BaseButton.vue'

	const $currSection = useStore(currSectionMap)
	const $allNavSections = useStore(filteredNavSectionsComputed)

	const isMenuOpen = ref<boolean>(false)

	const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value)

	const isLocatedHere = (id: string) => id == $currSection.value.id

	const navToSection = (section: string) => {
		useSetCurrSection(section)
		toggleMenu()
	}

	// transition enter only
	const styles = useCssModule()

	const onBeforeEnter = (el: Element) => {
		el.classList.remove(styles.listShown)
	}
	const onEnter = (el: Element, done: Function) => {
		const interval = setInterval(function () {
			el.classList.toggle(styles.listShown)
			clearInterval(interval)
		}, 20)
		done()
	}
	const onBeforeLeave = (el: Element) => {
		el.classList.remove(styles.listShown)
	}
</script>

<style module lang="scss">
	button.btnTOC {
		min-height: 48px;
		font-size: var(--s-1);
		grid-area: 1/3/2/4;
		height: var(--s4);
		justify-self: end;
		border: 1px solid var(--darkGray);
		border-radius: 0px var(--s10) var(--s10) 0px;
		margin-left: var(--s-3);
		padding: var(--s-2);
	}
	.lessonTOC {
		grid-area: 2/1/3/4;
		justify-self: center;
		list-style: none;
		padding: var(--s-10);
		margin: 0;
		max-width: 60ch;
		width: 100%;
		max-height: 90vh;
		overflow: scroll;
		-webkit-transition: var(--timeShort) all ease-in-out;
		transition: var(--timeShort) all ease-in-out;

		& {
			opacity: 0;
			transform: translateY(-10px);
		}
		&.listShown {
			opacity: 1;
			transform: translateY(0px);
		}
		> ol {
			padding-left: 0;
			margin: 0;
			> li {
				display: flex;
				flex-flow: row nowrap;
				align-items: center;
				justify-content: flex-start;
				gap: var(--s-4);
				margin-top: 0;

				+ li {
					border-top: 1px solid var(--darkGray);
				}

				&::before {
					-webkit-transition: var(--timeShort) background-color
						var(--transitionFlourish);
					transition: var(--timeShort) background-color
						var(--transitionFlourish);
					content: '';
					display: inline-block;
					height: var(--s-2);
					width: var(--s-2);
					border-radius: 50%;
				}
				&.greenDot::before {
					background-color: var(--green);
				}

				> a {
					padding: var(--s-2) var(--s-4);
					width: 100%;
					text-decoration: none;

					&:hover,
					&:focus {
						background-color: var(--peach);
						font-weight: 700;
						outline: none;
						text-decoration: underline;
					}
					&:visited {
						color: var(--purple);
					}
				}
			}
		}
	}
</style>
