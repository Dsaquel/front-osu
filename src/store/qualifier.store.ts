import { defineStore } from 'pinia';
import apiQualifier from '~/api/modules/api.qualifier';
import { Qualifier } from '~/types';

const useQualifierStore = defineStore('qualifier', () => {
  const qualifier = ref(undefined as Qualifier | undefined);

  async function fetchQualifier(tournamentId: number) {
    try {
      const data = await apiQualifier.fetchByTournamentId(tournamentId);
      qualifier.value = data;
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchCollection() {
    //
  }

  return { qualifier, fetchQualifier, fetchCollection };
});

export default useQualifierStore;
