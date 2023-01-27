import { Ref, useCssModule, computed } from 'vue'

/**
 * To be used when applying multiple conditional classes with CSS modules
 * @param baseClass class that is always applied
 * @param conditions condition to be met to apply conditional classes
 * @param conditionalClasses class to be applied if condition is met
 * @param moduleName Optional name for the css module
 * @returns array of classes to be applied to an element
 */

export default function useComputedCssModule(
	baseClass: string,
	conditions: Ref<boolean>[],
	conditionalClasses: string[],
	moduleName?: string
) {
	const styles = useCssModule(moduleName)

	const computedStyles = computed(() => {
		const stylesArr: string[] = [styles[baseClass]]

		for (const [i, condition] of conditions.entries()) {
			if (condition.value) stylesArr.push(styles[conditionalClasses[i]])
		}
		return stylesArr
	})

	return computedStyles
}
