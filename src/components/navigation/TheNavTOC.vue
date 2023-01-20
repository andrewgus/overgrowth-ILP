<template>
	<BaseButton
		:text="!isMenuOpen ? 'Go to&hellip;' : 'Close'"
		id="menuBtn"
		aria-haspopup="menu"
		:aria-expanded="isMenuOpen"
		aria-controls="navItemsList"
		@click="openMenu"
	/>
	<transition appear name="navTOC">
		<ol
			v-show="isMenuOpen"
			aria-label="table of contents links"
			id="navItemsList"
		>
			<li v-for="navItem in useNavItems" :key="navItem!.id">
				<a :href="`#${navItem!.id}`" @click="navToSection(navItem!.id)">{{
					navItem!.title
				}}</a>
			</li>
		</ol>
	</transition>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import BaseButton from '../base/BaseButton.vue'
	import {
		useSetCurrSection,
		useNavItems,
	} from '../../scripts/NavigationHandler.js'

	const isMenuOpen = ref(false)
	const openMenu = () => (isMenuOpen.value = !isMenuOpen.value)

	const navToSection = (section: string) => {
		useSetCurrSection(section)
		isMenuOpen.value = !isMenuOpen.value
	}
</script>

<style scoped>
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
