<template>
    <div v-if="activityExists" :class='$style.activityOption'>
        <BaseSwitchVue :name="`${activityName} activity`" :isEnabled="getActivityValue(activityType)"
            @toggleSwitch="useToggleActivity(activityType)" :aria-describedby='uniqueID' @mouseover='isTooltipShown = true'
            @mouseout='isTooltipShown = false' @focus='isTooltipShown = true' @blur='isTooltipShown = false' />
        <span :id='uniqueID' :class='$style.tooltip' v-show='isTooltipShown' aria-hidden='true'>{{ toolTipText
        }}</span>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@nanostores/vue'
import createNanoID from '../../composables/useCreateNanoID'
import {
    activitiesMap,
    useToggleActivity
} from '../../store/lessonStore'
import BaseSwitchVue from '../base/BaseSwitchVue.vue'
import type { ActivityType } from '../../types/ActivityTypes'

const uniqueID = createNanoID('activityToolTip')

type Props = {
    activityType: ActivityType
    toolTipText: string
}

const props = defineProps<Props>()
// to determine if toolTip should be shown
const isTooltipShown = ref<boolean>(false)
//  to determine the name of the switch
const activityName = props.activityType === 'practice' ? 'Practice' : 'Reflection'

// to set the activity to on/off with button click
const $activities = useStore(activitiesMap)
// grab the activity value from the store
const getActivityValue = (activity: ActivityType) => $activities.value[activity] as boolean

// To verify if the activity is registered or not
const activityExists = ref<boolean>(false)
activitiesMap.subscribe((activity) => {
    activityExists.value = activity.hasOwnProperty(props.activityType)
})

</script>

<style module lang="scss">
@use '../../styles/mixins/containerStyles.scss';

.activityOption {
    display: flex;
    flex-flow: row nowrap;
    justify-content: start;
    align-items: start;
    position: relative;

    &:hover,
    &:focus {
        z-index: 2;
    }

    >.tooltip {
        @include containerStyles.toolTipBox();
        top: 110%
    }
}
</style>