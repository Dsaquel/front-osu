import { defineStore } from 'pinia';
import apiTournament from '~/api/modules/api.tournament';
import router from '~/router';
import { ControlAccess, ParticipationUser, Tournament, UpdateTournamentDto, Role, Staffs } from '~/types';

const useTournamentStore = defineStore('tournament', () => {
  const access = ref(undefined as ControlAccess | undefined);
  const participationUser = ref(undefined as ParticipationUser | undefined);
  const tournament = ref(undefined as Tournament | undefined);
  const staffs = ref(undefined as Staffs | undefined);

  const staffsAccepted = computed(() =>
    Object.entries(staffs.value ?? {}).flatMap(([key, array]) =>
      array.filter((obj) => obj.validate).map((validObj) => ({ ...validObj, source: key.slice(0, -1) })),
    ),
  );

  const staffRequests = computed(() =>
    Object.entries(staffs.value ?? {}).flatMap(([key, array]) =>
      array.filter((obj) => !obj.validate).map((validObj) => ({ ...validObj, source: key.slice(0, -1) })),
    ),
  );

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

  async function fetchStaffs(tournamentId: number) {
    try {
      const data = await apiTournament.fetchStaffs(tournamentId);
      staffs.value = data;
    } catch (e) {
      router.push({ name: '403' });
    }
  }

  async function addStaff(tournamentId: number, role: Role) {
    try {
      return await apiTournament.addStaff(tournamentId, role);
    } catch (e) {
      if (e instanceof Error) {
        throw e.message;
      }
      console.log(e);
      throw e;
    }
  }

  async function acceptCandidate(tournamentId: number, staffId: number, role: Role) {
    try {
      const notification = await apiTournament.acceptCandidate(tournamentId, staffId, role);
      fetchStaffs(tournamentId);
      return notification;
    } catch (e) {
      if (e instanceof Error) {
        throw e.message;
      }
      console.log(e);
      throw e;
    }
  }

  async function removeStaff(tournamentId: number, staffId: number, role: Role) {
    try {
      const notification = await apiTournament.removeStaff(tournamentId, staffId, role);
      fetchStaffs(tournamentId);
      return notification;
    } catch (e) {
      if (e instanceof Error) {
        throw e.message;
      }
      console.log(e);
      throw e;
    }
  }

  async function updateTournament(updateTournamentDto: UpdateTournamentDto) {
    try {
      const data = await apiTournament.update(updateTournamentDto, tournament.value?.id as number);
      tournament.value = data;
    } catch (e) {
      console.log(e);
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
    acceptCandidate,
    removeStaff,
    staffsAccepted,
    staffRequests,
    fetchStaffs,
    fetchTournament,
    updateTournament,
  };
});

export default useTournamentStore;
