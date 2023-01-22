import service from '~/api/http';
import { UpdateTournamentDto, Tournament, ControlAccess } from '~/types';

const TournamentApi = {
  controlAccess: (tournamentId: number) => service.get<ControlAccess>(`/tournament/${tournamentId}/control-access`),
  fetch: (tournamentId: number) => service.get<Tournament>(`/tournament/${tournamentId}`),
  update: (updateTournamentDto: UpdateTournamentDto, tournamentId: number) =>
    service.put<Tournament>(`/tournament/${tournamentId}`, updateTournamentDto),
  addStaff: (tournamentId: number, role: 'mappooler' | 'admin' | 'referee') =>
    service.post(`/tournament/${tournamentId}/staff`, { role }),
};

export default TournamentApi;
