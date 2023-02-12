import _ from 'lodash';
import { defineStore } from 'pinia';
import apiMatch from '~/api/modules/api.match';
import { Match, groupBy, UpdateMatchDto, CreateRescheduleDto } from '~/types';

const useMatchStore = defineStore('match', () => {
  const matches = ref(undefined as Match[] | undefined);

  const matchesGrouped = computed(() => {
    if (matches.value) {
      const object = groupBy(matches.value, 'round');

      const upper = _.pickBy(object, (v, k) => {
        return +k >= 0;
      });
      for (const key in upper) {
        if (Object.prototype.hasOwnProperty.call(upper, key)) {
          upper[key] = upper[key].sort((matchA, matchB) => matchA.identifier - matchB.identifier);
        }
      }
      const lower = _.pickBy(object, (v, k) => {
        return +k < 0;
      });

      for (const key in lower) {
        if (Object.prototype.hasOwnProperty.call(lower, key)) {
          lower[key] = lower[key].sort((matchA, matchB) => matchA.identifier - matchB.identifier);
        }
      }

      return { upper, lower };
    }
    return null;
  });

  async function fetchMatches(tournamentId: number) {
    const data = await apiMatch.fetchMatches(tournamentId);
    matches.value = data;
  }

  async function updateMatch(matchId: number, udpateMatchDto: UpdateMatchDto) {
    const data = await apiMatch.udpateMatch(matchId, udpateMatchDto);
    matches.value = data;
  }

  async function createRescheduleMatch(matchId: number, createRescheduleDto: CreateRescheduleDto) {
    const data = await apiMatch.createReschedule(matchId, createRescheduleDto);
    matches.value = data;
  }

  return { matches, fetchMatches, updateMatch, matchesGrouped, createRescheduleMatch };
});

export default useMatchStore;
