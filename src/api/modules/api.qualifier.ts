import service from '~/api/http';
import { Qualifier } from '~/types';

const QualifierApi = {
  fetchByTournamentId: (tournamentId: number) => service.get<Qualifier>(`/qualifier`, { tournamentId }),
  createLobby: (qualifierId: number, schedule: string) =>
    service.post<any>(`/qualifier/${qualifierId}/lobby`, { schedule }),
};

export default QualifierApi;
