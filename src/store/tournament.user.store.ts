import { defineStore } from 'pinia';
import { CreateTournamentDto, Tournament } from '~/types';
import apiTournament from '~/api/modules/api.tournament';

const useTournamentUserStore = defineStore('tournamentUser', () => {
  const tournament = ref<Tournament | null>(null);

  function store(data: Tournament) {
    tournament.value = { ...data };
  }

  async function fetch() {
    // store();
  }

  async function create(payload: CreateTournamentDto) {
    const tournamentCreated = await apiTournament.create(payload);
    console.log(tournamentCreated);
    store(tournamentCreated);
  }

  return { tournament, fetch, create };
});

export default useTournamentUserStore;
