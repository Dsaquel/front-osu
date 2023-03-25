import service from '~/api/http';
import { Draft, Tournament, User } from '~/types';

const UserApi = {
  fetch: () => service.get<User>(`/user/me`),
  fetchUserDrafts: () => service.get<Draft[]>(`/user/drafts`),
  fetchUserInvolvement: () => service.get<Tournament[]>(`/user/participation`),
  fetchUsersByUsername: (username: string) => service.get<User[]>(`/user`, { username }),
};

export default UserApi;
