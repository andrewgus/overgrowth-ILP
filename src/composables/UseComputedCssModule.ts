import { ComputedRef, useCssModule, computed } from 'vue'
/**
 * To be used when applying multiple conditional classes with CSS modules
 * @param baseClass class that is always applied
 * @param conditionalClassesMap Map of reactive boolean values to be met & classes to be applied based on them
 * @param moduleName Optional name for the css module
 * @returns array of classes to be applied to an element
 */
export default function useComputedCssModule(
	baseClass: string,
	conditionClassesMap: Map<ComputedRef<boolean>, string>,
	moduleName?: string
) {
	const styles = useCssModule(moduleName)

	const computedStyles = computed(() => {
		const stylesArr: string[] = [styles[baseClass]]

		for (const [condition, styleClass] of conditionClassesMap.entries()) {
			if (condition.value) stylesArr.push(styles[styleClass])
		}
		return stylesArr
	})
	return computedStyles
}
