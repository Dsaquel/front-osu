import service from '~/api/http';
import { Qualifier } from '~/types';

const QualifierApi = {
  fetchByTournamentId: (tournamentId: number) => service.get<Qualifier>(`/qualifier/${tournamentId}`),
};

export default QualifierApi;
