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
				<span
					:id="`${navItem!.id}dot`"
					title="You are here"
					aria-label="You are here"
					:class="{ greenDot: isHere(navItem!.id) }"
					:aria-hidden="!isHere(navItem!.id)"
					role="marquee"
				></span>
				<a
					:aria-describedby="`${navItem!.id}dot`"
					:href="`#${navItem!.id}`"
					@click="navToSection(navItem!.id)"
					>{{ navItem!.title }}</a
				>
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

	const props = defineProps({
		currSectionId: {
			type: Number,
			required: true,
		},
	})

	const isMenuOpen = ref<boolean>(false)

	const openMenu = () => (isMenuOpen.value = !isMenuOpen.value)

	const isHere = (id: string) => {
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
	#navItemsList span {
		transition: 0.3s all var(--transition);
		display: inline-block;
		height: var(--s-2);
		width: var(--s-2);
		border-radius: 50%;
		margin-right: var(--s-5);
	}
	.greenDot {
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
		transition: all 0.5s ease-in-out;
	}
	.navTOC-enter-to,
	.navTOC-leave-from {
		transform: translateY(0);
		opacity: 1;
	}
</style>
