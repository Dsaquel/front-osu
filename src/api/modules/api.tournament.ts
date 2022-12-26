import service from '~/api/http';
import { Tournament } from '~/types';

const TournamentApi = {
  fetch: (id: number) => service.get<Tournament>(`/tournament/${id}`),
};

export default TournamentApi;
