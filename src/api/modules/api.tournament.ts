import service from '~/api/http';
import { Tournament, CreateTournamentDto } from '~/types';

const UserApi = {
  fetch: () => service.get<Tournament>(`/tournament`),
  create: (payload: CreateTournamentDto) => service.post<Tournament>(`/tournament`, payload),
  fetchDraft: (params: { userId: number }) => service.get<Tournament[]>(`/tournament/draft`, { params }),
};

export default UserApi;
