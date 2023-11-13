<template>
    <div :class='$style.finalFeedback'>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const emits = defineEmits<{
    readyForNext: [isReadyForNextStep: boolean]
}>()

onMounted(() => emits('readyForNext', true))
</script>

<style module lang='scss'>
@use '../../../styles/mixins/containerStyles.scss';

.finalFeedback {
    @include containerStyles.flexCenter();
    min-height: 10ch;
}
</style>