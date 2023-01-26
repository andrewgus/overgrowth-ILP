import { computed, useCssModule } from 'vue'

/**
 * To be used when applying multiple conditional classes with CSS modules
 * @param baseClass class that is always applied
 * @param conditions condition to be met to apply condition classes
 * @param conditionalClasses class to be applied if condition is met
 * @param moduleName Optional name for the css module
 * @returns array of classes to be applied to an element
 */

const useComputedCssModule = (
	baseClass: string,
	conditions: boolean[],
	conditionalClasses: string[],
	moduleName?: string
) => {
	const styles = useCssModule(moduleName)

	const computedStyles = computed(() => {
		const styleArr: string[] = [styles[baseClass]]

		for (const [i, condition] of conditions.entries()) {
			if (condition) styleArr.push(styles[conditionalClasses[i]])
		}

		return styleArr
	})
	return computedStyles
}

export { useComputedCssModule }
