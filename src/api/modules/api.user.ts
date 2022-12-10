import service from '~/api/http';
import { User } from '~/types';

const UserApi = {
  fetch: () => service.get<User>(`/users/me`),
};

export default UserApi;
