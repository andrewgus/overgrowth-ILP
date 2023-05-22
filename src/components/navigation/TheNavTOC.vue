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
			<ol aria-describedby="additonalSections">
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
				<li v-if="areLockedSections">
					<p id="additonalSections">
						{{
							Object.keys($allLockedSections).length
						}}&nbsp;more&nbsp;section{{
							Object.keys($allLockedSections).length === 1 ? '' : 's'
						}}
						can&nbsp;become available as&nbsp;you complete&nbsp;activities
					</p>
				</li>
			</ol>
		</div>
	</transition>
</template>

<script setup lang="ts">
	import { ref, computed, useCssModule } from 'vue'
	import { mapStores } from '@nanostores/vue'
	import {
		allSectionsMap,
		filteredNavSectionsComputed,
		filteredLockedSectionsComputed,
		currSectionMap,
		useSetCurrSection,
	} from '../../store/lessonStore'
	import BaseButton from '../base/BaseButton.vue'

	const {
		allSectionsMap: $allSections,
		currSectionMap: $currSection,
		filteredNavSectionsComputed: $allNavSections,
		filteredLockedSectionsComputed: $allLockedSections,
	} = mapStores({
		allSectionsMap,
		currSectionMap,
		filteredNavSectionsComputed,
		filteredLockedSectionsComputed,
	})

	const isMenuOpen = ref<boolean>(false)

	const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value)

	const isLocatedHere = (id: string) => id == $currSection.value.id

	const navToSection = (section: string) => {
		useSetCurrSection(section)
		toggleMenu()
	}

	const areLockedSections = computed(() => {
		return (
			Object.keys($allNavSections.value).length !==
			Object.keys($allSections.value).length
		)
	})

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
	@use '../../styles/mixins/transitions.scss';
	button.btnTOC {
		height: var(--s4);
		font-size: var(--s-1);
		grid-area: 1/3/2/4;
		justify-self: end;
		border: 1px solid var(--darkGray);
		border-radius: 0px var(--s10) var(--s10) 0px;
		margin-left: var(--s-3);
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
		@include transitions.short();

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
					filter: drop-shadow(0 0 2px var(--green2));
				}

				> a,
				> p {
					padding: var(--s-2) var(--s-4);
					width: 100%;
				}

				> a {
					text-decoration: none;

					&:hover,
					&:focus {
						background-color: var(--peach);
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
