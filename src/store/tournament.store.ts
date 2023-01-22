import { defineStore } from 'pinia';
import apiTournament from '~/api/modules/api.tournament';
import router from '~/router';
import { ControlAccess, Tournament, UpdateTournamentDto } from '~/types';

const useTournamentStore = defineStore('tournament', () => {
  const access = ref(undefined as ControlAccess | undefined);
  const tournament = ref(undefined as Tournament | undefined);

  const isAuthorized = computed(
    () =>
      access.value &&
      (access.value.isAdmin || access.value.isMappooler || access.value.isOwner || access.value.isReferee),
  );

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

  async function addStaff(tournamentId: number, role: 'mappooler' | 'admin' | 'referee') {
    try {
      return await apiTournament.addStaff(tournamentId, role);
    } catch (e: any) {
      throw e.message;
    }
  }

  async function updateTournament(updateTournamentDto: UpdateTournamentDto) {
    try {
      const data = await apiTournament.update(updateTournamentDto, tournament.value?.id as number);
      tournament.value = data;
    } catch (e: any) {
      console.log(e.message);
    }
  }

  return { access, isAuthorized, controlAccess, tournament, addStaff, fetchTournament, updateTournament };
});

export default useTournamentStore;
