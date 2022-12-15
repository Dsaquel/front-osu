import service from '~/api/http';
import { User } from '~/types';

const UserApi = {
  fetch: () => service.get<User>(`/users/me`),
  updateTournamentDraft: (payload: { tournamentDraft: string }) => service.post<User>(`/users/draft`, payload),
};

export default UserApi;
