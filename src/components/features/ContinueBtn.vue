<!--
  
  TODO: This component...
    — will be based off the BaseButton & BaseIndicator components.
    — however, will have a few if/else situations tied to it.
    — will be used at the end of any given feature component. As these featuresMap are also stopping points in the lesson. Users will not be able to continue with the lesson until they have completed the feature. Until they have completed the feature, the Btn will be disabled. Once complete, they will be able to click it and then show the indicator.
    — Optionally, the complete btn will instead be a "Save & Complete" btn, where users will not only complete and continue, but also download a PDF of that activity, so that they can provide their finished results to their professor
-->

<template>
	<BaseButton text="Complete?"></BaseButton>
	<BaseIndicator text="Scoll to continue"></BaseIndicator>
</template>

<script setup lang="ts">
	import BaseButton from '../base/BaseButton.vue'
	import BaseIndicator from '../base/BaseIndicator.vue'
</script>

<style modules lang="scss"></style>
