import { defineStore } from 'pinia';
import apiMatch from '~/api/modules/api.match';
import { Match } from '~/types';

const useMatchStore = defineStore('match', () => {
  const matches = ref(undefined as Match[] | undefined);

  async function fetchMatches(tournamentId: number) {
    const data = await apiMatch.fetchMatches(tournamentId);
    matches.value = data;
  }

  return { matches, fetchMatches };
});

export default useMatchStore;
