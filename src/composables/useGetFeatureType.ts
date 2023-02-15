import type { FeatureType } from '../store/FeatureSettingsStore'

export default function useGetFeatureType(
	feature: string
): boolean | FeatureType {
	if (feature.includes('reflection')) return 'reflection'
	if (feature.includes('practice')) return 'practice'
	if (feature.includes('choice')) return 'choice'
	return false
}
