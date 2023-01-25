import service from '~/api/http';
import {
  UpdateTournamentDto,
  Tournament,
  ControlAccess,
  ParticipationUser,
  NotificationStaff,
  Role,
  Staffs,
} from '~/types';

const TournamentApi = {
  controlAccess: (tournamentId: number) => service.get<ControlAccess>(`/tournament/${tournamentId}/control-access`),
  participationOfUser: (tournamentId: number) =>
    service.get<ParticipationUser>(`/tournament/${tournamentId}/own-participation`),
  fetch: (tournamentId: number) => service.get<Tournament>(`/tournament/${tournamentId}`),
  fetchStaffs: (tournamentId: number) => service.get<Staffs>(`/tournament/${tournamentId}/staff`),
  update: (updateTournamentDto: UpdateTournamentDto, tournamentId: number) =>
    service.put<Tournament>(`/tournament/${tournamentId}`, updateTournamentDto),
  addStaff: (tournamentId: number, role: Role) =>
    service.post<NotificationStaff>(`/tournament/${tournamentId}/staff`, { role }),
};

export default TournamentApi;
