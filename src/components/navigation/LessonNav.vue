<template>
	<transition name="lessonNav">
		<nav v-show="isOnContent" id="lessonNav">
			<div>
				<p>
					Currently on:
					{{ useStore(contentQuery.currSectionTitle).value }}
					{{ currSectionTitle }}
				</p>
				<Menu v-slot="{ open }">
					<MenuButton>{{
						!open ? `Take me to&hellip;` : 'Close menu'
					}}</MenuButton>
					<MenuItems as="ol">
						<MenuItem
							as="li"
							v-for="navItem in navItems"
							:key="navItem!.sectionId"
						>
							<a :href="`#${navItem!.sectionId}`">{{ navItem!.title }}</a>
						</MenuItem>
					</MenuItems>
				</Menu>
			</div>
		</nav>
	</transition>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import { contentQuery } from '../../store/index.js'
	import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
	import { ref, computed, onMounted, watchEffect } from 'vue'

	const isOnContent = ref()

	onMounted(() => {
		isOnContent.value = useStore(contentQuery.isOnContent).value

		watchEffect(() => {
			isOnContent.value = useStore(contentQuery.isOnContent).value
		})
	})

	const navItems = computed(() => {
		return useStore(contentQuery.allSections).value
	})

	const currSectionTitle = computed(() => {
		console.log(useStore(contentQuery.allSections).value)
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
		grid-template-columns: 1fr 1fr;
	}
	div > button {
		grid-area: 1/2/2/3;
		justify-self: end;
		box-shadow: none;
		border: 1px solid var(--darkGray);
		padding: var(--s-5);
		font-size: var(--s-1);
		background-color: var(--lightBlue);
		border-radius: 6px;
		display: inline-block;
	}
	div > ol {
		grid-area: 2/1/3/3;
		justify-self: center;
	}
	div > ol > li + li {
		margin-top: var(--s-3);
	}
	div > p {
		font-size: var(--s-1);
		max-width: 40ch;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
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
