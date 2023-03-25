import service from '~/api/http';
import {
  UpdateTournamentDto,
  Tournament,
  ControlAccess,
  ParticipationUser,
  TemplateNotification,
  Role,
  Staffs,
  Player,
  ParticipantIndividual,
  ParticipantTeam,
  ParticipantRequest,
  ParticipantInvitation,
} from '~/types';

const TournamentApi = {
  controlAccess: (tournamentId: number) => service.get<ControlAccess>(`/tournament/${tournamentId}/control-access`),
  participationOfUser: (tournamentId: number) =>
    service.get<ParticipationUser>(`/tournament/${tournamentId}/own-participation`),
  fetchAll: () => service.get<Tournament[]>(`/tournament`),
  fetch: (tournamentId: number) => service.get<Tournament>(`/tournament/${tournamentId}`),
  fetchStaffs: (tournamentId: number) => service.get<Staffs>(`/tournament/${tournamentId}/staff`),
  update: (updateTournamentDto: UpdateTournamentDto, tournamentId: number) =>
    service.put<Tournament>(`/tournament/${tournamentId}`, updateTournamentDto),
  addStaff: (tournamentId: number, role: Role, validate?: boolean, userId?: number) =>
    service.post<TemplateNotification>(`/tournament/${tournamentId}/staff`, { role, validate, userId }),
  acceptCandidate: (tournamentId: number, staffId: number, role: Role) =>
    service.put<TemplateNotification>(`/tournament/${tournamentId}/staff/${staffId}`, { role }),
  removeStaff: (tournamentId: number, staffId: number, role: Role) =>
    service.delete<TemplateNotification>(`/tournament/${tournamentId}/staff/${staffId}`, { role }),
  addIndividualParticipant: (tournamentId: number) =>
    service.post<TemplateNotification>(`/tournament/${tournamentId}/participant/individual`),
  addTeamParticipant: (tournamentId: number, teamName?: string, teamId?: number) =>
    service.post<TemplateNotification>(`/tournament/${tournamentId}/participant/team`, { teamName, teamId }),
  fetchParticipants: (tournamentId: number) =>
    service.get<ParticipantIndividual[] | ParticipantTeam[]>(`/tournament/${tournamentId}/participant`),
  updateParticipantValidation: (tournamentId: number, participantId: number, validate: boolean) =>
    service.put<TemplateNotification>(`/tournament/${tournamentId}/participant/${participantId}`, { validate }),
  startTournament: (tournamentId: number) => service.post<void>(`/tournament/${tournamentId}/start`),
  fetchPlayer: (playerId: number, tournamentId: number) =>
    service.get<Player | null>(`/tournament/${tournamentId}/player/${playerId}`),
  passToBracketPhase: (tournamentId: number) => service.post<void>(`/tournament/${tournamentId}/bracket-phase`),
  updateTournamentPrivacy: (tournamentId: number, isPublic: boolean) =>
    service.put<Tournament>(`/tournament/${tournamentId}/public`, { isPublic }),
  fetchTeams: (tournamentId: number) => service.get<ParticipantTeam[]>(`/tournament/${tournamentId}/team`),
  fetchParticipationOfParticipantTeam: (tournamentId: number) =>
    service.get<number[]>(`/tournament/${tournamentId}/participant/team/participation`),
  fetchParticipantTeamRequests: (tournamentId: number, teamId: number) =>
    service.get<ParticipantRequest[]>(`/tournament/${tournamentId}/participant/team/${teamId}/request`),
  fetchParticipantTeamInvitations: (tournamentId: number, teamId: number) =>
    service.get<ParticipantInvitation[]>(`/tournament/${tournamentId}/participant/team/${teamId}/invitation`),
  changeRequestStatus: (tournamentId: number, teamId: number, requestId: number, status: 'accepted' | 'declined') =>
    service.put<TemplateNotification>(`/tournament/${tournamentId}/participant/team/${teamId}/request/${requestId}`, {
      status,
    }),
};

export default TournamentApi;
