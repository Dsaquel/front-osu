import service from '~/api/http';
import { Mappool } from '~/types';

const MappoolApi = {
  fetchTournamentMappools: (tournamentId: number) => service.get<Mappool[]>(`/tournament/${tournamentId}/mappools`),
  fetchQualifierMappool: (qualifierId: number) => service.get<Mappool[]>(`/qualifier/${qualifierId}/mappool`),
};

export default MappoolApi;
