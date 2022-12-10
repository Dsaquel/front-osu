import service from '~/api/http';
import { User } from '~/types';

const UserApi = {
  fetch: () => service.get<User>(`/me`),
};

export default UserApi;
