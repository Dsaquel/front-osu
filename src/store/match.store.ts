import _ from 'lodash';
import { defineStore } from 'pinia';
import apiMatch from '~/api/modules/api.match';
import { Match, groupBy } from '~/types';

const useMatchStore = defineStore('match', () => {
  const matches = ref(undefined as Match[] | undefined);

  const matchesGrouped = computed(() => groupBy<Match(matches?.value, (v) => v.round));

  async function fetchMatches(tournamentId: number) {
    const data = await apiMatch.fetchMatches(tournamentId);
    matches.value = data;
  }

  return { matches, fetchMatches, matchesGrouped };
});

export default useMatchStore;
