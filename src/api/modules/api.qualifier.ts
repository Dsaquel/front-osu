import service from '~/api/http';
import { Lobby, Qualifier, TemplateNotification } from '~/types';

const QualifierApi = {
  fetchByTournamentId: (tournamentId: number) => service.get<Qualifier>(`/qualifier`, { tournamentId }),
  fetchQualifierLobbies: (qualifierId: number) => service.get<Lobby[]>(`/qualifier/${qualifierId}/lobby`),
  createLobby: (qualifierId: number, schedule: string) =>
    service.post<TemplateNotification>(`/qualifier/${qualifierId}/lobby`, { schedule }),
  addParticipantToLobby: (lobbyId: number, qualifierId: number) =>
    service.post<Lobby[]>(`/qualifier/${qualifierId}/lobby/${lobbyId}/participant`),
};

export default QualifierApi;
