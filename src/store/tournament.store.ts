import { defineStore } from 'pinia';
import apiTournament from '~/api/modules/api.tournament';
import router from '~/router';
import { ControlAccess, Tournament, UpdateTournamentDto } from '~/types';

const useTournamentStore = defineStore('tournament', () => {
  const access = ref({} as ControlAccess | object);
  const tournament = ref(undefined as Tournament | undefined);

  async function controlAccess(tournamentId: number) {
    try {
      const data = await apiTournament.controlAccess(tournamentId);
      access.value = data;
    } catch (e) {
      throw router.push({ name: '403' });
    }
  }

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

  async function updateTournament(updateTournamentDto: UpdateTournamentDto) {
    try {
      const data = await apiTournament.update(updateTournamentDto, tournament.value?.id as number);
      tournament.value = data;
    } catch (e: any) {
      console.log(e.message);
    }
  }

  return { access, controlAccess, tournament, fetchTournament, fetchCollection, updateTournament };
});

export default useTournamentStore;
