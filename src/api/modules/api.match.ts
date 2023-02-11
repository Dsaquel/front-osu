import service from '~/api/http';
import { CreateRescheduleDto, Match, UpdateMatchDto } from '~/types';

const MatchApi = {
  fetchMatches: (tournamentId: number) => service.get<Match[]>(`/match`, { tournamentId }),
  udpateMatch: (matchId: number, updateMatchDto: UpdateMatchDto) =>
    service.put<Match[]>(`/match/${matchId}`, updateMatchDto),
  createReschedule: (matchId: number, createRescheduleDto: CreateRescheduleDto) =>
    service.post<Match[]>(`/match/${matchId}/reschedule`, createRescheduleDto),
};

export default MatchApi;
