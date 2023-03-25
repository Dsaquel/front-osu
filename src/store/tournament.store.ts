import { defineStore } from 'pinia';
import apiTournament from '~/api/modules/api.tournament';
import router from '~/router';
import {
  ControlAccess,
  ParticipationUser,
  Tournament,
  UpdateTournamentDto,
  Role,
  Staffs,
  User,
  Player,
  ParticipantIndividual,
  ParticipantTeam,
  isParticipantIndividual,
  ParticipantRequest,
  ParticipantInvitation,
} from '~/types';

const useTournamentStore = defineStore('tournament', () => {
  const sourcesOrder = ['owner', 'admin', 'mappooler', 'referee'];
  const access = ref(undefined as ControlAccess | undefined);
  const participationUser = ref(undefined as ParticipationUser | undefined);
  const tournament = ref(undefined as Tournament | undefined);
  const tournaments = ref(undefined as Tournament[] | undefined);
  const staffs = ref(undefined as Staffs | undefined);
  const participants = ref(undefined as ParticipantIndividual[] | ParticipantTeam[] | undefined);
  const winner = ref(undefined as Player | undefined | null);
  const teams = ref(undefined as ParticipantTeam[] | undefined);
  const participationOfParticipantTeam = ref(undefined as number[] | undefined);
  const participantsRequests = ref(undefined as ParticipantRequest[] | undefined);
  const participantsInvitations = ref(undefined as ParticipantInvitation[] | undefined);

  const staffRequests = computed(() =>
    Object.entries(staffs.value ?? {}).flatMap(([key, array]) =>
      array.filter((obj) => !obj.validate).map((validObj) => ({ ...validObj, source: key.slice(0, -1) })),
    ),
  );

  const participantsAccepted = computed<ParticipantIndividual[] | ParticipantTeam[] | undefined>(() => {
    if (!participants.value) return undefined;
    if (isParticipantIndividual(participants.value)) {
      return participants.value.sort((a, b) => a.user.rank - b.user.rank);
    }
    return participants.value.sort((a, b) => a.name.localeCompare(b.name));
  });

  const staffsAccepted = computed(() => {
    const accepted: (
      | (Omit<(typeof staffRequests.value)[number], 'source'> & {
          sources: string[];
          secondStaffId?: number;
        })
      | { user: User; sources: string[]; userId?: undefined; secondStaffId?: undefined }
    )[] = [];
    Object.entries(staffs.value ?? {}).forEach(([key, array]) => {
      array
        .filter((obj) => obj.validate)
        .forEach((staff) => {
          const existingStaff = accepted.find((sr) => sr.userId === staff.userId);
          if (existingStaff) {
            existingStaff.sources.push(key.slice(0, -1));
            existingStaff.secondStaffId = staff.id;
          } else {
            accepted.push({ ...staff, sources: [key.slice(0, -1)] });
          }
        });
    });
    accepted.push({ sources: ['owner'], user: tournament.value?.owner as User });
    return accepted.sort((a, b) => sourcesOrder.indexOf(a.sources[0]) - sourcesOrder.indexOf(b.sources[0]));
  });

  const isAuthorized = computed(
    () =>
      access.value &&
      (access.value.isAdmin || access.value.isMappooler || access.value.isOwner || access.value.isReferee),
  );

  const isOwnerOrAdmin = computed(() => access.value && (access.value.isAdmin || access.value.isOwner));

  async function fetchTournaments() {
    const data = await apiTournament.fetchAll();
    tournaments.value = data;
  }

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
      //
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

  async function addStaff(tournamentId: number, role: Role, validate?: boolean, userId?: number) {
    try {
      return await apiTournament.addStaff(tournamentId, role, validate, userId);
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

  async function fetchParticipants(tournamentId: number) {
    try {
      const data = await apiTournament.fetchParticipants(tournamentId);
      participants.value = data;
    } catch (e) {
      console.log(e);
    }
  }

  async function addIndividualParticipant(tournamentId: number) {
    try {
      const data = await apiTournament.addIndividualParticipant(tournamentId);
      await fetchParticipants(tournamentId);
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async function addTeamParticipant(tournamentId: number, teamName?: string, teamId?: number) {
    try {
      const data = await apiTournament.addTeamParticipant(tournamentId, teamName, teamId);
      await fetchParticipants(tournamentId);
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async function updateParticipantValidation(participantId: number, tournamentId: number, validate: boolean) {
    try {
      const data = await apiTournament.updateParticipantValidation(tournamentId, participantId, validate);
      await fetchParticipants(tournamentId);
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async function startTournament(tournamentId: number) {
    try {
      await apiTournament.startTournament(tournamentId);
      await fetchTournament(tournamentId);
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchPlayer(playerId: number, tournamentId: number) {
    const data = await apiTournament.fetchPlayer(playerId, tournamentId);
    winner.value = data;
  }

  async function passToBracketPhase(tournamentId: number) {
    await apiTournament.passToBracketPhase(tournamentId);
    await fetchTournament(tournamentId);
  }

  async function updateTournamentPrivacy(tournamentId: number, isPublic: boolean) {
    const data = await apiTournament.updateTournamentPrivacy(tournamentId, isPublic);
    Object.assign(tournament.value as Tournament, data);
  }

  async function fetchTeams(tournamentId: number) {
    const data = await apiTournament.fetchTeams(tournamentId);
    teams.value = data;
  }

  async function fetchParticipantTeamRequests(tournamentId: number, teamId: number) {
    const data = await apiTournament.fetchParticipantTeamRequests(tournamentId, teamId);
    participantsRequests.value = data;
  }

  async function fetchParticipantTeamInvitations(tournamentId: number, teamId: number) {
    const data = await apiTournament.fetchParticipantTeamInvitations(tournamentId, teamId);
    participantsInvitations.value = data;
  }

  async function fetchParticipationOfParticipantTeam(tournamentId: number) {
    const data = await apiTournament.fetchParticipationOfParticipantTeam(tournamentId);
    participationOfParticipantTeam.value = data;
  }

  async function changeRequestStatus(
    tournamentId: number,
    requestId: number,
    status: 'accepted' | 'declined',
    teamId: number,
  ) {
    const notification = await apiTournament.changeRequestStatus(tournamentId, teamId, requestId, status);
    await fetchParticipants(tournamentId);
    await fetchParticipantTeamRequests(tournamentId, teamId);
    return notification;
  }

  async function sendInvitationsTeamToUser(tournamentId: number, teamId: number, usersId: number[]) {
    const notification = await apiTournament.sendInvitationsTeamToUser(tournamentId, teamId, usersId);
    await fetchParticipantTeamInvitations(tournamentId, teamId);
    return notification;
  }

  return {
    access,
    winner,
    isAuthorized,
    isOwnerOrAdmin,
    fetchControlAccess,
    fetchParticipationOfUser,
    tournament,
    tournaments,
    teams,
    fetchTournaments,
    participationUser,
    addStaff,
    acceptCandidate,
    removeStaff,
    sendInvitationsTeamToUser,
    staffsAccepted,
    staffRequests,
    participantsRequests,
    participantsInvitations,
    fetchStaffs,
    fetchParticipantTeamInvitations,
    fetchTournament,
    updateTournament,
    addIndividualParticipant,
    addTeamParticipant,
    fetchParticipants,
    fetchTeams,
    fetchParticipationOfParticipantTeam,
    participantsAccepted,
    updateParticipantValidation,
    startTournament,
    fetchPlayer,
    changeRequestStatus,
    passToBracketPhase,
    fetchParticipantTeamRequests,
    updateTournamentPrivacy,
    participationOfParticipantTeam,
  };
});

export default useTournamentStore;
