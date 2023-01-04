import { defineStore } from 'pinia';
import apiTournament from '~/api/modules/api.tournament';
import router from '~/router';
import { Tournament, UpdateTournamentDto } from '~/types';

const useTournamentStore = defineStore('tournament', () => {
  const tournament = ref(undefined as Tournament | undefined);

  async function fetchTournament(tournamentId: number) {
    try {
      const data = await apiTournament.fetch(tournamentId);
      tournament.value = data;
    } catch (e) {
      router.push({ name: '403' });
    }
  }

  async function fetchCollection() {
    //
  }

  async function update(updateTournamentDto: UpdateTournamentDto) {
    try {
      const data = await apiTournament.update(updateTournamentDto, tournament.value?.id as number);
      tournament.value = data;
    } catch (e: any) {
      console.log(e.message);
    }
  }

  return { tournament, fetchTournament, fetchCollection, update };
});

export default useTournamentStore;
