<template>
	<transition name="lessonNav">
		<nav v-show="useStore(contentQuery.isOnContent).value" id="lessonNav">
			<div>
				<p>
					Currently on:
					{{ useStore(contentQuery.contentTitle).value }}
				</p>
				<ul>
					<!-- TODO: WORK OUT BUGS BELOW -->
					<li
						v-for="section in useStore(contentQuery.allSections).value"
						:key="section.id"
					>
						<a :href="`#${section.id}`">{{ section.title }}</a>
					</li>
				</ul>
			</div>
			<Menu>
				<MenuButton>Let&rsquo;s go elsewhere&hellip;</MenuButton>
				<MenuItems>
					<MenuItem v-slot="{ active }">
						<a :class="{ 'bg-blue-500': active }" href="/account-settings">
							Account settings
						</a>
					</MenuItem>
					<MenuItem v-slot="{ active }">
						<a :class="{ 'bg-blue-500': active }" href="/account-settings">
							Documentation
						</a>
					</MenuItem>
					<MenuItem disabled>
						<span class="opacity-75">Invite a friend (coming soon!)</span>
					</MenuItem>
				</MenuItems>
			</Menu>
		</nav>
	</transition>
</template>

<script setup lang="ts">
	import { useStore } from '@nanostores/vue'
	import { contentQuery } from '../../store/index.js'
	import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
</script>

<style scoped>
	nav {
		display: block;
		background-color: hsla(0, 0%, 100%, 0.95);
		padding: var(--s-5) 0;
		border-width: 0 0 1px 0;
		border-style: solid;
		border-color: var(--lightGray);
		width: 100%;
		position: sticky;
		top: 0;
	}
	nav > div {
		margin: 0 auto;
		max-width: 72ch;
	}
	nav p {
		background-color: hsla(0, 0%, 100%, 1);
		font-size: var(--s-1);
		max-width: 40%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		-webkit-mask-image: linear-gradient(
			transparent 0%,
			white 20%,
			white 80%,
			transparent 100%
		);
		mask-image: linear-gradient(
			transparent 0%,
			white 20%,
			white 80%,
			transparent 100%
		);
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
