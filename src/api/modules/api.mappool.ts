import service from '~/api/http';
import { TournamentMappool, QualifierMappool, CreateMappoolDto, UpdateMappoolDto } from '~/types';

const MappoolApi = {
  fetchTournamentMappools: (tournamentId: number) =>
    service.get<TournamentMappool[]>(`/tournament/${tournamentId}/mappools`),
  fetchQualifierMappool: (qualifierId: number) => service.get<QualifierMappool>(`/qualifier/${qualifierId}/mappool`),
  createTournamentMappool: (tournamentId: number, createMappoolDto: CreateMappoolDto) =>
    service.post<TournamentMappool[]>(`/tournament/${tournamentId}/mappools`, createMappoolDto),
  updateTournamentMappool: (tournamentId: number, mappoolId: number, updateMappoolDto: UpdateMappoolDto) =>
    service.put<TournamentMappool[]>(`/tournament/${tournamentId}/mappools/${mappoolId}`, updateMappoolDto),
  updateQualifierMappool: (qualifierId: number, mappoolId: number, updateMappoolDto: UpdateMappoolDto) =>
    service.put<TournamentMappool[]>(`/qualifier/${qualifierId}/mappools/${mappoolId}`, updateMappoolDto),
  deleteTournamentMappool: (tournamentId: number, mappoolId: number) =>
    service.delete<TournamentMappool[]>(`/tournament/${tournamentId}/mappools/${mappoolId}`),
};

export default MappoolApi;
