import service from '~/api/http';
import { Mappool } from '~/types';

const MappoolApi = {
  fetchMappools: (tournamentId: number) => service.get<Mappool[]>(`/tournament/${tournamentId}/mappools`),
};

export default MappoolApi;
