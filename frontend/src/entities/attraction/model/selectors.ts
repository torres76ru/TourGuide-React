import type { RootState } from 'app/store/mainStore';
import type { Attraction } from './types';

export const selectAttractionsByTag = (state: RootState, tag: string) => {
  const data = state.attraction.attractionsByTag[tag];
  return {
    attractions: data?.attractions ?? [],
    loading: data?.loading ?? false,
    error: data?.error ?? null,
  };
};

export const selectAttractionsByTags = (state: RootState, tags: string[]) => {
  return tags.reduce<
    Record<string, { attractions: Attraction[]; loading: boolean; error: string | null }>
  >((acc, tag) => {
    const data = state.attraction.attractionsByTag[tag];
    acc[tag] = {
      attractions: data?.attractions ?? [],
      loading: data?.loading ?? false,
      error: data?.error ?? null,
    };
    return acc;
  }, {});
};
