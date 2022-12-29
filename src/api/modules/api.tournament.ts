import service from '~/api/http';
import { UpdateTournamentDto, Tournament } from '~/types';

const TournamentApi = {
  fetch: (tournamentId: number) => service.get<Tournament>(`/tournament/${tournamentId}`),
  update: (updateTournamentDto: UpdateTournamentDto, tournamentId: number) =>
    service.put<Tournament>(`/tournament/${tournamentId}`),
};

export default TournamentApi;
