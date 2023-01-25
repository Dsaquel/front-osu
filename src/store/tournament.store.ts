import { defineStore } from 'pinia';
import apiTournament from '~/api/modules/api.tournament';
import router from '~/router';
import { ControlAccess, ParticipationUser, Tournament, UpdateTournamentDto, Role, Staff } from '~/types';

const useTournamentStore = defineStore('tournament', () => {
  const access = ref(undefined as ControlAccess | undefined);
  const participationUser = ref(undefined as ParticipationUser | undefined);
  const tournament = ref(undefined as Tournament | undefined);
  const staff = ref(undefined as Staff | undefined);

  const isAuthorized = computed(
    () =>
      access.value &&
      (access.value.isAdmin || access.value.isMappooler || access.value.isOwner || access.value.isReferee),
  );

  async function fetchControlAccess(tournamentId: number) {
    try {
      const data = await apiTournament.controlAccess(tournamentId);
      access.value = data;
    } catch (e) {
      throw router.push({ name: '403' });
    }
  }

  async function fetchParticipationOfUser(tournamentId: number) {
    try {
      const data = await apiTournament.participationOfUser(tournamentId);
      participationUser.value = data;
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

  async function fetchStaff(tournamentId: number) {
    try {
      const data = await apiTournament.fetchStaff(tournamentId);
      staff.value = data;
    } catch (e) {
      router.push({ name: '403' });
    }
  }

  async function addStaff(tournamentId: number, role: Role) {
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

  return {
    access,
    isAuthorized,
    fetchControlAccess,
    fetchParticipationOfUser,
    tournament,
    participationUser,
    addStaff,
    fetchStaff,
    fetchTournament,
    updateTournament,
  };
});

export default useTournamentStore;
