<template>
    <div class='visuallyHidden' aria-live='polite'>{{ ariaLiveAnnouncement }}</div>
</template>

<script setup lang="ts">
import { ariaLiveAnnouncement } from '../../store/ariaLiveStore' 
</script>