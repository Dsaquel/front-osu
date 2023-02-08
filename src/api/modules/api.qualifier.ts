import service from '~/api/http';
import { Lobby, Qualifier, QualifierMap, QualifierParticipant, TemplateNotification, UpdateLobbyDto } from '~/types';

const QualifierApi = {
  fetchByTournamentId: (tournamentId: number) => service.get<Qualifier>(`/qualifier`, { tournamentId }),
  fetchQualifierLobbies: (qualifierId: number) => service.get<Lobby[]>(`/qualifier/${qualifierId}/lobby`),
  createLobby: (qualifierId: number, schedule: string) =>
    service.post<TemplateNotification>(`/qualifier/${qualifierId}/lobby`, { schedule }),
  addParticipantToLobby: (lobbyId: number, qualifierId: number) =>
    service.post<Lobby[]>(`/qualifier/${qualifierId}/lobby/${lobbyId}/participant`),
  updateLobby: (qualifierId: number, lobbyId: number, updateLobbyDto: UpdateLobbyDto) =>
    service.put<Lobby[]>(`/qualifier/${qualifierId}/lobby/${lobbyId}`, updateLobbyDto),
  deleteLobby: (qualifierId: number, lobbyId: number) =>
    service.delete<Lobby[]>(`/qualifier/${qualifierId}/lobby/${lobbyId}`),
  updateScoresLobby: (qualifierId: number, matchId: number) =>
    service.put<string>(`/qualifier/${qualifierId}/score`, { matchId }),
  fetchMapsScore: (qualifierId: number) => service.get<QualifierMap[]>(`/qualifier/${qualifierId}/map`),
  fetchParticipantsRanking: (qualifierId: number) =>
    service.get<QualifierParticipant[]>(`/qualifier/${qualifierId}/participant/ranking`),
};

export default QualifierApi;
