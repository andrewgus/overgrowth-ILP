import { nanoid } from 'nanoid'

/**
 * To create a unique ID for pairing content via aria-described by
 * @param componentName use 'Astro.self.name'
 * @param ifPropTrue a component boolean prop for determining if nanoid is needed
 * @returns string
 */
export default function createNanoID<T extends string | boolean>(
	componentName: string,
	ifPropTrue?: T
) {
	if (!ifPropTrue) return `${componentName}-${nanoid(12)}`
	return (!!ifPropTrue as boolean) ? `${componentName}-${nanoid(12)}` : ''
}
