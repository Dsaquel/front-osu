import service from '~/api/http';
import { Match, UpdateMatchDto } from '~/types';

const MatchApi = {
  fetchMatches: (tournamentId: number) => service.get<Match[]>(`/match`, { tournamentId }),
  udpateMatch: (matchId: number, updateMatchDto: UpdateMatchDto) =>
    service.put<Match[]>(`/match/${matchId}`, updateMatchDto),
};

export default MatchApi;
