import { defineStore } from 'pinia';
import apiMap from '~/api/modules/api.map';
import { Beatmap, CreateMapDto } from '~/types';

const useMapStore = defineStore('map', () => {
  const beatmap = ref(undefined as Beatmap | undefined);
  const beatmaps = ref(undefined as Beatmap[] | undefined);

  async function fetchBeatmap(beatmapId: number) {
    try {
      const data = await apiMap.fetchOne(beatmapId);
      beatmap.value = data;
    } catch (_) {
      //
    }
  }

  async function createMap(createMapDto: CreateMapDto, mappoolId: number) {
    try {
      const data = await apiMap.createMap(createMapDto, mappoolId);
      console.log(data);
      // beatmaps.value = data;
    } catch (e) {
      console.log('error ', e);
      //
    }
  }

  return {
    beatmap,
    fetchBeatmap,
    createMap,
  };
});

export default useMapStore;
