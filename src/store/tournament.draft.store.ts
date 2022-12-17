import { defineStore } from 'pinia';
import { CreateTournamentDto, Tournament } from '~/types';
import apiTournament from '~/api/modules/api.tournament';

const useTournamentDraftStore = defineStore('tournamentDraft', () => {
  const { user } = userStore();
  const tournaments = ref<Tournament[] | null>(null);

  function store(data: Tournament[]) {
    tournaments.value = { ...data };
  }

  async function fetch() {
    const data = await apiTournament.fetchDraft({ userId: user?.id as number });
    store(data);
  }

  async function create(payload: CreateTournamentDto) {
    await apiTournament.create(payload);
  }

  return { tournaments, fetch, create };
});

export default useTournamentDraftStore;
