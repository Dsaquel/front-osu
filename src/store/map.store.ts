import { defineStore } from 'pinia';
import apiMap from '~/api/modules/api.map';
import { Beatmap } from '~/types';

const useMapStore = defineStore('map', () => {
  const beatmap = ref(undefined as Beatmap | undefined);

  async function fetchBeatmap(beatmapId: number) {
    try {
      const data = await apiMap.fetch(beatmapId);
      beatmap.value = data;
    } catch (_) {
      //
    }
  }

  return {
    beatmap,
    fetchBeatmap,
  };
});

export default useMapStore;
