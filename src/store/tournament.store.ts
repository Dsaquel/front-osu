import { defineStore } from 'pinia';
import apiTournament from '~/api/modules/api.tournament';
import { Tournament } from '~/types';

const useTournamentStore = defineStore('tournament', () => {
  const tournament = ref(undefined as Tournament | undefined);

  async function fetch(tournamentId: number) {
    const data = await apiTournament.fetch(tournamentId);
    tournament.value = data;
  }

  async function fetchCollection() {
    //
  }

  async function update() {
    //
  }

  return { tournament, fetch, fetchCollection, update };
});

export default useTournamentStore;
