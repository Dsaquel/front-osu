import service from '~/api/http';
import { Draft, User } from '~/types';

const UserApi = {
  fetch: () => service.get<User>(`/user/me`),
  updateTournamentDraft: (payload: { tournamentDraft: string }) => service.post<User>(`/user/draft`, payload),
  fetchUserDrafts: () => service.get<Draft[]>(`/user/drafts`),
};

export default UserApi;
