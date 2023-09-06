<template>
	<slot></slot>
	<template v-if='practiceOptions.length > 1'>
		<section v-for='(asyncComponent, i) in asyncComponentsWithCondition' :key='i' tabindex='-1'
			:class='$style.practiceStep' ref='activitySectionEls'>
			<component :is='asyncComponent' v-bind='getConditionalProps(i)'
				@readyForNext='handleNextActivityLoad(i, $event)'>
				<h3>Part {{ i + 1 }}</h3>
			</component>
		</section>
	</template>
	<template v-else>
		<component v-for='(asyncComponent, i) in asyncComponentsWithCondition' :key='i' :is='asyncComponent'
			v-bind='getConditionalProps(i)' @readyForNext='handleNextActivityLoad(i, $event)'>
		</component>
	</template>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, watch, nextTick } from 'vue'
import { activityProgressStore, userPracticeStore, initUserPracticeStore } from '../../store/activityOptionsStore';
import getLocalStorage from '../../composables/useGetLocalStorage'
import type { validPracticeActivityOptions } from '../../types/ActivityTypes'

type Props = {
	id: string
	prompts: string[]
	practiceOptions: validPracticeActivityOptions[]
	isMatching__itemsAndAnswers: string[][]
	isMath__QsAndAs: string[][]
}
const props = defineProps<Props>()

const activitySectionEls = ref<HTMLElement[] | null>()

const asyncComponents = props.practiceOptions.map((type) => defineAsyncComponent(() => import(`./practiceOptions/${type}.vue`)));

// using localStorage to determine progress thus far and apply that progress on reload.
const localStorageAnswers = getLocalStorage(props.id, 'isPracticeOptionStepsComplete') as boolean[]
const isPracticeOptionsComplete = ref<boolean[]>(!!localStorageAnswers
	? localStorageAnswers
	: props.practiceOptions.map(() => false));


localStorageAnswers ? initUserPracticeStore(props.id, isPracticeOptionsComplete.value) : initUserPracticeStore(props.id)


// Only load the next asyncComponent if the previous one is complete. Will always load the first asyncComponent.
const asyncComponentsWithCondition = computed(() => {
	let prevComponentComplete = true;

	return asyncComponents.filter((_, index) => {
		if (prevComponentComplete) {
			const isComplete = isPracticeOptionsComplete.value[index];
			prevComponentComplete = isComplete;
			return true;
		}
		return false;
	});
})
// When emitted, signals the current practice type is complete and to load next component
const handleNextActivityLoad = async (index: number, isCurrPracticeTypeComplete: boolean) => {
	isPracticeOptionsComplete.value[index] = isCurrPracticeTypeComplete
	userPracticeStore[props.id].isPracticeOptionStepsComplete = isPracticeOptionsComplete.value
	await nextTick();
	if (!!activitySectionEls.value) {
		const nextStep = activitySectionEls.value[index].nextElementSibling as HTMLElement
		!!nextStep && nextStep.focus()
	}
}
// watch for when all practiceOptions are complete to signal that the attempt is finshed
watch(isPracticeOptionsComplete.value, (newValue) => {
	if (newValue.every((val) => val === true)) activityProgressStore[props.id].isAttemptsFinished = true
}, { immediate: true })
// watch the store. If the store is reset, reset these values
watch(userPracticeStore, (newStore) => {
	if (newStore[props.id].isPracticeOptionStepsComplete.every((val) => val === false)) {
		activityProgressStore[props.id].isAttemptsFinished = false
		isPracticeOptionsComplete.value.fill(false)
	}
})

// construct prop objects for individual practiceOption components for v-bind
const getUniversalProps = (index: number, typeSpecificProps: Record<string, any>,) => {
	const lastIndex = props.practiceOptions.length - 1
	return {
		id: props.id,
		prompt: props.prompts[index],
		isMultisteps: props.practiceOptions.length > 1 && index !== lastIndex,
		isStepComplete: isPracticeOptionsComplete.value[index],
		...typeSpecificProps
	};
};
const matchingProps = (index: number) => getUniversalProps(index, { itemsAndAnswers: props.isMatching__itemsAndAnswers });
const mathProps = (index: number) => getUniversalProps(index, { MathQsAndAs: props.isMath__QsAndAs });

const specificTypePropsMap: Record<validPracticeActivityOptions, (index: number) => object | null> = {
	Matching: (index: number) => matchingProps(index),
	Math: (index: number) => mathProps(index),
};

const getConditionalProps = (index: number) => {
	return specificTypePropsMap[props.practiceOptions[index]]?.(index) || null;
};
</script>
<style module lang='scss'>
.practiceStep {
	margin-top: var(--s6);

	h3 {
		margin-top: 0;
	}
}
</style>