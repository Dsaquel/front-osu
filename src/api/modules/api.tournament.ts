import service from '~/api/http';
import { Tournament, CreateTournamentDto } from '~/types';

const UserApi = {
  fetch: () => service.get<Tournament>(`/tournament`),
  create: (payload: CreateTournamentDto) => service.post<Tournament>(`/tournament`, payload),
};

export default UserApi;
