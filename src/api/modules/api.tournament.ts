import service from '~/api/http';
import { Tournament } from '~/types';

const TournamentApi = {
  fetch: (tournamentId: number) => service.get<Tournament>(`/tournament/${tournamentId}`),
};

export default TournamentApi;
