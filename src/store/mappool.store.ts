import { defineStore } from 'pinia';
import apiMappool from '~/api/modules/api.mappool';
import { TournamentMappool, QualifierMappool, CreateMappoolDto } from '~/types';
// import useUserStore from './user.store';

const useMappoolStore = defineStore('mappool', () => {
  const tournamentMappools = ref(undefined as TournamentMappool[] | undefined);
  const qualifierMappool = ref(undefined as QualifierMappool | undefined);

  async function fetchTournamentMappools(tournamentId: number) {
    try {
      const data = await apiMappool.fetchTournamentMappools(tournamentId);
      tournamentMappools.value = data;
    } catch (e) {
      console.log(e);
    }
  }
  async function fetchQualifierMappool(qualifierId: number) {
    try {
      const data = await apiMappool.fetchQualifierMappool(qualifierId);
      qualifierMappool.value = data;
    } catch (e) {
      console.log(e);
    }
  }

  async function createTournamentMappool(tournamentId: number, createMappoolDto: CreateMappoolDto) {
    try {
      const data = await apiMappool.createTournamentMappool(tournamentId, createMappoolDto);
      tournamentMappools.value = data;
    } catch (e) {
      console.log(e);
    }
  }

  return {
    tournamentMappools,
    qualifierMappool,
    fetchTournamentMappools,
    fetchQualifierMappool,
    createTournamentMappool,
  };
});

export default useMappoolStore;
