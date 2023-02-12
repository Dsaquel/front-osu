import service from '~/api/http';
import {
  UpdateTournamentDto,
  Tournament,
  ControlAccess,
  ParticipationUser,
  TemplateNotification,
  Role,
  Staffs,
  Participant,
  Player,
} from '~/types';

const TournamentApi = {
  controlAccess: (tournamentId: number) => service.get<ControlAccess>(`/tournament/${tournamentId}/control-access`),
  participationOfUser: (tournamentId: number) =>
    service.get<ParticipationUser>(`/tournament/${tournamentId}/own-participation`),
  fetch: (tournamentId: number) => service.get<Tournament>(`/tournament/${tournamentId}`),
  fetchStaffs: (tournamentId: number) => service.get<Staffs>(`/tournament/${tournamentId}/staff`),
  update: (updateTournamentDto: UpdateTournamentDto, tournamentId: number) =>
    service.put<Tournament>(`/tournament/${tournamentId}`, updateTournamentDto),
  addStaff: (tournamentId: number, role: Role, validate?: boolean) =>
    service.post<TemplateNotification>(`/tournament/${tournamentId}/staff`, { role, validate }),
  acceptCandidate: (tournamentId: number, staffId: number, role: Role) =>
    service.put<TemplateNotification>(`/tournament/${tournamentId}/staff/${staffId}`, { role }),
  removeStaff: (tournamentId: number, staffId: number, role: Role) =>
    service.delete<TemplateNotification>(`/tournament/${tournamentId}/staff/${staffId}`, { role }),
  addParticipant: (tournamentId: number) =>
    service.post<TemplateNotification>(`/tournament/${tournamentId}/participant`),
  fetchParticipants: (tournamentId: number) => service.get<Participant[]>(`/tournament/${tournamentId}/participant`),
  removeParticipant: (tournamentId: number, participantId: number) =>
    service.put<TemplateNotification>(`/tournament/${tournamentId}/participant/${participantId}`),
  updatePublication: (tournamentId: number) => service.post<void>(`/tournament/${tournamentId}/start`),
  fetchPlayer: (playerId: number, tournamentId: number) =>
    service.get<Player | null>(`/tournament/${tournamentId}/player/${playerId}`),
};

export default TournamentApi;
