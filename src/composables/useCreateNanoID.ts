import { nanoid } from 'nanoid'

/**
 * To create a unique ID for pairing content via aria-described by
 * @param ifPropTrue boolean for determining if nanoid is needed
 * @param componentName 'Astro.self.name'
 * @returns string
 */
export default function createNanoID<T>(ifPropTrue: T, componentName: string) {
	return (!!ifPropTrue as boolean) ? `${componentName}-${nanoid(8)}` : ''
}
