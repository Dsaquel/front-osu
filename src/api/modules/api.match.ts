import service from '~/api/http';
import { Match } from '~/types';

const MatchApi = {
  fetchMatches: (tournamentId: number) => service.get<Match[]>(`/match`, { tournamentId }),
  // update: (updateTournamentDto: UpdateTournamentDto, tournamentId: number) =>
  //   service.put<Tournament>(`/match/${tournamentId}`, updateTournamentDto),
};

export default MatchApi;
