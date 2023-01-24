<template>
	<div>
		<BaseButton
			:text="!isMenuOpen ? 'Go to&hellip;' : 'Close'"
			aria-haspopup="menu"
			:aria-expanded="isMenuOpen"
			aria-controls="navItemsList"
			@click="openMenu"
		/>
	</div>
	<transition appear name="navTOC">
		<ol
			v-show="isMenuOpen"
			aria-label="table of contents links"
			id="navItemsList"
		>
			<li
				v-for="navItem in useNavItems"
				:key="navItem!.id"
				:class="{ greenDot: isLocatedHere(navItem!.id) }"
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
</script>

<style scoped>
	div {
		grid-area: 1/3/2/4;
		justify-self: end;
		overflow: hidden;
		border: 1px solid var(--darkGray);
		border-radius: 0px var(--s5) var(--s5) 0px;
		margin-left: var(--s-3);
	}
	button {
		border: none;
		overflow: hidden;
		padding: var(--s-5);
		font-size: var(--s-1);
		display: inline-block;
		border-radius: 0px 20px 20px 0px;
		height: 48px;
	}
	button:focus {
		outline: none;
		background-color: var(--blue1);
		color: var(--white);
	}
	button:focus:hover {
		box-shadow: none;
	}
	ol {
		grid-area: 2/1/3/4;
		justify-self: center;
		list-style: none;
		padding: 0;
		max-width: 60ch;
		width: 100%;
	}
	li {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: flex-start;
		gap: var(--s-4);
	}
	li::before {
		-webkit-transition: 0.4s all var(--transition);
		transition: 0.4s all var(--transition);
		content: '';
		display: inline-block;
		height: var(--s-2);
		width: var(--s-2);
		border-radius: 50%;
	}
	.greenDot::before {
		background-color: var(--green);
	}
	li + li {
		border-top: 1px solid var(--darkGray);
	}
	a {
		padding: var(--s-2) var(--s-4);
		width: 100%;
		text-decoration: none;
	}
	a:visited {
		color: var(--purple);
	}
	a:focus,
	a:hover {
		font-weight: 700;
		outline: none;
		text-decoration: underline;
	}

	/* navTOC transition */
	.navTOC-enter-from,
	.navTOC-leave-to {
		transform: translateY(calc(-1 * var(--s0)));
		opacity: 0;
	}
	.navTOC-enter-active,
	.navTOC-leave-active {
		-webkit-transition: all 0.5s ease-in-out;
		transition: all 0.5s ease-in-out;
	}
	.navTOC-enter-to,
	.navTOC-leave-from {
		transform: translateY(0);
		opacity: 1;
	}
</style>
