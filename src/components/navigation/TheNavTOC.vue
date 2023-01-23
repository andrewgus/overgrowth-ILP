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
			<li
				v-for="navItem in useNavItems"
				:key="navItem!.id"
				:class="{ greenDot: isLocatedHere(navItem!.id) }"
			>
				<BaseButton
					link
					:url="`#${navItem!.id}`"
					:text="navItem!.title"
					@click="navToSection(navItem!.id)"
					:title="isLocatedHere(navItem!.id) ? 'You are here' : ''"
				/>
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
	ol {
		grid-area: 2/1/3/3;
		justify-self: center;
		list-style: none;
		padding: 0;
		max-width: 55ch;
		width: 100%;
	}
	li {
		text-indent: var(--s-2);
	}
	li + li {
		margin-top: var(--s-1);
	}
	li a {
		all: unset;
		text-decoration: underline;
	}
	li a:visited {
		color: var(--purple);
	}
	li a:hover {
		font-weight: 700;
		background-color: var(--peach);
	}
	li::before {
		-webkit-transition: 0.4s all var(--transition);
		transition: 0.4s all var(--transition);
		content: '';
		margin-left: calc(-1 * var(--s-2));
		margin-right: var(--s-5);
		display: inline-block;
		height: var(--s-2);
		width: var(--s-2);
		border-radius: 50%;
	}
	.greenDot::before {
		background-color: var(--green);
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
