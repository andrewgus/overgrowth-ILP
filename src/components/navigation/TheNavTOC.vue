<template>
	<BaseButton
		isForNav
		:class="$style.btnTOC"
		:text="!isMenuOpen ? 'Go to&hellip;' : 'Close'"
		aria-haspopup="menu"
		:aria-expanded="isMenuOpen"
		aria-controls="navItemsList"
		@click="openMenu"
	/>
	<transition
		:css="false"
		@before-enter="onBeforeEnter"
		@enter="onEnter"
		@before-leave="onBeforeLeave"
	>
		<ol
			:class="$style.listTOC"
			v-show="isMenuOpen"
			aria-label="table of contents links"
			id="navItemsList"
		>
			<li
				v-for="navItem in useNavItems"
				:key="navItem!.id"
				:class="{ [$style.greenDot]: isLocatedHere(navItem!.id) }"
			>
				<a
					:href="`#${navItem!.id}`"
					@click="navToSection(navItem!.id)"
					:title="isLocatedHere(navItem!.id) ? 'You are here' : ''"
					>{{ navItem!.title }}</a
				>
			</li>
		</ol>
	</transition>
</template>

<script setup lang="ts">
	import {
		useSetCurrSection,
		useNavItems,
	} from '../../composables/UseNavigation.js'
	import { ref } from 'vue'
	import BaseButton from '../base/BaseButton.vue'

	const props = defineProps({
		currSectionId: {
			type: Number,
			required: true,
		},
	})

	const isMenuOpen = ref<boolean>(false)
	const openMenu = () => (isMenuOpen.value = !isMenuOpen.value)

	const isLocatedHere = (id: string) => {
		return id === `section${props.currSectionId}`
	}
	const navToSection = (section: string) => {
		useSetCurrSection(section)
		isMenuOpen.value = !isMenuOpen.value
	}

	// transition enter only
	const onBeforeEnter = (el: HTMLElement) => {
		el.style.transform = 'translateY(-10px)'
		el.style.opacity = '0'
	}
	const onEnter = (el: HTMLElement, done: Function) => {
		let opacityVal = 0
		let transformVal = -10
		const interval = setInterval(function () {
			opacityVal += 0.1
			transformVal += 1
			el.style.transform = `translateY(${transformVal}px)`
			el.style.opacity = `${opacityVal}`
			if (transformVal === 0) {
				clearInterval(interval)
			}
		}, 20)
		done()
	}
	const onBeforeLeave = (el: HTMLElement) => {
		el.style.transform = 'translateY(-10px)'
		el.style.opacity = '0'
	}
</script>

<style module lang="scss">
	.btnTOC {
		grid-area: 1/3/2/4;
		height: var(--s4);
		justify-self: end;
		border: 1px solid var(--darkGray);
		border-radius: 0px var(--s10) var(--s10) 0px;
		margin-left: var(--s-3);
	}
	.listTOC {
		grid-area: 2/1/3/4;
		justify-self: center;
		list-style: none;
		padding: 0;
		margin: 0;
		max-width: 60ch;
		width: 100%;
		max-height: 90vh;
		overflow: scroll;

		> li {
			display: flex;
			flex-flow: row nowrap;
			align-items: center;
			justify-content: flex-start;
			gap: var(--s-4);

			+ li {
				border-top: 1px solid var(--darkGray);
			}

			&::before {
				-webkit-transition: 0.4s all var(--transition);
				transition: 0.4s all var(--transition);
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
</style>
