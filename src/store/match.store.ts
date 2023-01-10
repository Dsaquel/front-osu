import _ from 'lodash';
import { defineStore } from 'pinia';
import apiMatch from '~/api/modules/api.match';
import { Match, groupBy } from '~/types';

const useMatchStore = defineStore('match', () => {
  const matches = ref(undefined as Match[] | undefined);

  const matchesGrouped = computed(() => {
    if (matches.value) {
      const object = groupBy(matches.value, 'round');
      const upper = _.pickBy(object, (v, k) => {
        return +k >= 0;
      });
      const lower = _.pickBy(object, (v, k) => {
        return +k < 0;
      });

      return { upper, lower };
    }
    return null;
  });

  // const upperBracket = computed(() => {
  //   if(matchesGrouped.value) {
  //     matchesGrouped.value.filter(arr => )
  //   }
  // })

  async function fetchMatches(tournamentId: number) {
    const data = await apiMatch.fetchMatches(tournamentId);
    matches.value = data;
  }

  return { matches, fetchMatches, matchesGrouped };
});

export default useMatchStore;
