import { defineStore } from 'pinia';
import apiMappool from '~/api/modules/api.mappool';
import { Mappool, MappoolQualifier } from '~/types';
// import useUserStore from './user.store';

const useMappoolStore = defineStore('mappool', () => {
  const tournamentMappools = ref(undefined as Mappool[] | undefined);
  const qualifierMappool = ref(undefined as MappoolQualifier | undefined);

  async function fetchTournamentMappools(tournamentId: number) {
    try {
      const data = await apiMappool.fetchTournamentMappools(tournamentId);
      tournamentMappools.value = data;
    } catch (e) {
      console.log(e);
    }
  }
  async function fetchQualifierMappool(qualifierId: number) {
    const data = await apiMappool.fetchQualifierMappool(qualifierId);
    qualifierMappool.value = data;
  }

  return { tournamentmappools, qualifierMappool, fetchTournamentMappools, fetchQualifierMappool };
});

export default useMappoolStore;
