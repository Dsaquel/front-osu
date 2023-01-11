import service from '~/api/http';
import { TournamentMappool, QualifierMappool } from '~/types';

const MappoolApi = {
  fetchTournamentMappools: (tournamentId: number) =>
    service.get<TournamentMappool[]>(`/tournament/${tournamentId}/mappools`),
  fetchQualifierMappool: (qualifierId: number) => service.get<QualifierMappool>(`/qualifier/${qualifierId}/mappool`),
};

export default MappoolApi;
