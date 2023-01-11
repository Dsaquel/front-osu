import { defineStore } from 'pinia';
import apiMappool from '~/api/modules/api.mappool';
import { Mappool } from '~/types';
// import useUserStore from './user.store';

const useMappoolStore = defineStore('mappool', () => {
  const tournamentmappools = ref(undefined as Mappool[] | undefined);
  const qualifierMappool = ref(undefined as MappoolQualifier | undefined)

  async function fetchMappools(tournamentId: number) {
    try {
      const data = await apiMappool.fetchMappools(tournamentId);
      mappools.value = data;
    } catch (e) {
      console.log(e);
    }
  }
  async function fetchMappoolQualifier() {
    const data = api.fetchMappoolQualifier(qualifierId)
  }

  return { mappools, fetchMappools };
});

export default useMappoolStore;
