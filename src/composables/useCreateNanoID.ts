import { nanoid } from 'nanoid'

/**
 * To create a unique ID for pairing content via aria-described by
 * @param ifPropTrue boolean for determining if nanoid is needed
 * @param componentName 'Astro.self.name'
 * @returns string
 */
export default function createNanoID<T extends string | boolean>(
	componentName: string,
	ifPropTrue?: T
) {
	if (!ifPropTrue) return `${componentName}-${nanoid(8)}`
	return (!!ifPropTrue as boolean) ? `${componentName}-${nanoid(8)}` : ''
}
