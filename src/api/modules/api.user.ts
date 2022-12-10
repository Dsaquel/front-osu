import service from '~/api/http';
import { User } from '~/types';

const UserApi = {
  fetch: (params: object) => service.get<User>(`/me`, params),
};

export default UserApi;
