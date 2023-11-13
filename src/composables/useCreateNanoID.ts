import { nanoid } from 'nanoid'

/**
 * To create a unique ID for pairing content via aria-described by
 * @param componentName name of component
 * @param isPropTruthy a component prop for determining if nanoid conditionally is needed. Will always return true, if not provided
 * @returns string
 */
export default function createNanoID<T extends string | boolean>(
	componentName: string,
	isPropTruthy: T = true as T
) {
	return !!isPropTruthy ? `${componentName}-${nanoid(15)}` : ''
}
