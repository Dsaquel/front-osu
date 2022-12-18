import service from '~/api/http';
import { CreateTournamentDto, Draft } from '~/types';

const TournamentApi = {
  // fetch: () => service.get<Tournament>(`/tournament`),
  create: (payload: CreateTournamentDto) => service.post<Draft>(`/tournament/draft`, payload),
  fetchDraft: (params: { userId: number }) => service.get<Draft[]>(`/tournament/draft`, { params }),
};

export default TournamentApi;
