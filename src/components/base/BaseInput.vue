<!-- TODO: build this out. -->
<template>
    <input :type="setType">
</template>

<script setup lang="ts">
type Props = {
    setType: 'text' | 'checkbox' | 'number' | 'radio' | 'range'
}
defineProps<Props>()
</script>

<style modules lang='scss'>
@use '../../styles/mixins/containerStyles.scss';
@use '../../styles/mixins/shadows.scss';
@use '../../styles/mixins/transitions.scss';

input {
    @include containerStyles.darkBorder();
    border-radius: var(--s-10);
    display: inline;
    margin-left: var(--s-6);
    padding: 0 var(--s-6);
    max-width: var(--s10);

    &:hover {
        @include shadows.hoverBoxShadow();
    }
}
</style>