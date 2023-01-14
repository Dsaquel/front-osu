import { defineStore } from 'pinia';
import apiMap from '~/api/modules/api.map';
import apiMappool from '~/api/modules/api.mappool';
import { Beatmap, CreateMapDto, QualifierMap, TournamentMap } from '~/types';

const useMapStore = defineStore('map', () => {
  const beatmap = ref(undefined as Beatmap | undefined);

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
      if (createMapDto.qualifierId) {
        await apiMap.createMap<QualifierMap>(createMapDto, mappoolId);
        await apiMappool.fetchTournamentMappools(createMapDto.qualifierId);
      } else if (createMapDto.tournamentId) {
        await apiMap.createMap<TournamentMap>(createMapDto, mappoolId);
        await apiMappool.fetchTournamentMappools(createMapDto.tournamentId);
      }
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
