import { defineStore } from 'pinia';
import apiMap from '~/api/modules/api.map';
import { Beatmap, CreateMapDto, QualifierMap, TournamentMap } from '~/types';
import mappoolStore from './mappool.store';

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
        await mappoolStore().fetchQualifierMappool(createMapDto.qualifierId);
      } else if (createMapDto.tournamentId) {
        await apiMap.createMap<TournamentMap>(createMapDto, mappoolId);
        await mappoolStore().fetchTournamentMappools(createMapDto.tournamentId);
      }
    } catch (e) {
      console.log('error ', e);
      //
    }
  }

  async function deleteMap(mappoolId: number, mapId: number, type: 'tournament' | 'qualifier', id: number) {
    try {
      if (type === 'qualifier') {
        await apiMap.deleteOne(mappoolId, mapId, {
          qualifierId: id,
        });
        await mappoolStore().fetchQualifierMappool(id);
      } else if (type === 'tournament') {
        await apiMap.deleteOne(mappoolId, mapId, {
          tournamentId: id,
        });
        await mappoolStore().fetchTournamentMappools(id);
      }
    } catch (e) {
      console.log('error ', e);
    }
  }

  async function refreshDataBeatmap(mappoolId: number, mapId: number, type: 'tournament' | 'qualifier', id: number) {
    try {
      if (type === 'qualifier') {
        await apiMap.refreshDataBeatmap(mappoolId, mapId, {
          qualifierId: id,
        });
        await mappoolStore().fetchQualifierMappool(id);
      } else if (type === 'tournament') {
        await apiMap.refreshDataBeatmap(mappoolId, mapId, {
          tournamentId: id,
        });
        await mappoolStore().fetchTournamentMappools(id);
      }
    } catch (e) {
      console.log('error ', e);
    }
  }

  return {
    beatmap,
    fetchBeatmap,
    createMap,
    deleteMap,
    refreshDataBeatmap,
  };
});

export default useMapStore;
